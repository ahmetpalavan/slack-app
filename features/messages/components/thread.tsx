import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
import { AlertTriangle, Loader2, XIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Message } from '~/components/message';
import { Button } from '~/components/ui/button';
import { Id } from '~/convex/_generated/dataModel';
import { useCurrentMember } from '~/features/members/api/use-current-member';
import { useGenerateUploadUrl } from '~/features/upload/api/use-generate-upload-url';
import { useChannelId } from '~/hooks/use-channel-id';
import { useWorkspaceId } from '~/hooks/use-workspace-id';
import { useCreateMessage } from '../api/use-create-message';
import { useGetMessage } from '../api/use-get-message';
import { useGetMessages } from '../api/use-get-messages';

interface ThreadProps {
  messageId: Id<'messages'>;
  onClose: () => void;
}

type CreateMessageValues = {
  channelId: Id<'channels'>;
  workspaceId: Id<'workspaces'>;
  parentMessageId: Id<'messages'>;
  body: string;
  image: Id<'_storage'> | undefined;
};

const Editor = dynamic(() => import('~/components/editor'), { ssr: false });

const TIME_THRESHOLD = 5;

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { data: message, isLoading: loadingMessage } = useGetMessage({ id: messageId });
  const { data: currentMember, isLoading: loadingMember } = useCurrentMember({ workspaceId });
  const {
    results,
    status,
    loadMore,
    isLoading: loadingMessages,
  } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const { mutate: createMessage, isPending } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const canLoadMore = status === 'CanLoadMore';
  const isLoadingMore = status === 'LoadingMore';

  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);
  const [editorKey, setEditorKey] = useState<number>(0);

  const handleSubmit = useCallback(async ({ body, image }: { body: string; image: File | null }) => {
    try {
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        parentMessageId: messageId,
        channelId,
        image: undefined,
        workspaceId,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error('Failed to generate upload url');
        }

        const result = await fetch(url, {
          method: 'POST',
          body: image,
          headers: {
            'Content-Type': image.type,
          },
        });

        if (!result.ok) {
          toast.error(result.statusText);
          throw new Error('Failed to upload image');
        }

        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values);
      setEditorKey((key) => key + 1);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      editorRef.current?.enable(true);
    }
  }, []);

  const groupedMessages = results?.reduce(
    (acc, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].unshift(message);

      return acc;
    },
    {} as Record<string, typeof results>
  );

  const editorRef = useRef<Quill | null>(null);

  if (loadingMessage || status === 'LoadingFirstPage') {
    return (
      <div className='flex justify-center items-center h-full'>
        <Loader2 className='animate-spin text-muted-foreground size-6' />
      </div>
    );
  }

  if (!message) {
    return (
      <div className='flex flex-col h-full'>
        <div className='flex justify-between items-center p-4 border-b'>
          <p className='text-lg font-bold'>Thread</p>
          <Button onClick={onClose} className='text-muted-foreground hover:text-white'>
            <XIcon className='size-5' />
          </Button>
        </div>
        <div className='flex flex-col gap-y-2 justify-center items-center h-full'>
          <AlertTriangle className='text-muted-foreground size-8' />
          <p className='text-lg text-muted-foreground'>Message not found</p>
        </div>
      </div>
    );
  }

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return 'Today';
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'EEEE, MMMM d');
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center px-6 py-3  border-b'>
        <p className='text-lg font-bold'>Thread</p>
        <Button onClick={onClose} variant='ghost' size='iconSm'>
          <XIcon className='size-5' />
        </Button>
      </div>
      <div className='flex flex-col-reverse messages-scrollbar pb-4 flex-1 overflow-y-auto'>
        {Object.entries(groupedMessages || {}).map(([date, messages]) => (
          <div key={date}>
            <div className='text-center my-2 relative'>
              <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300' />
              <span className='relative inline-block px-4 py-1 bg-white border-gray-300 border rounded-full text-gray-500 text-sm font-semibold'>
                {formatDateLabel(date)}
              </span>
            </div>
            {results.map((message, index) => {
              const prevMessage = results[index - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user._id === message.user._id &&
                differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) < TIME_THRESHOLD;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  reactions={message.reactions}
                  memberId={message?.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={message.memberId === currentMember?._id}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  threadName={message.threadName}
                  hideThreadButton
                  createdAt={message._creationTime}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                />
              );
            })}
          </div>
        ))}
        <div
          className='h-1'
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entries]) => {
                  if (entries.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1 }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />

        {isLoadingMore && (
          <div className='flex justify-center items-center'>
            <Loader2 className='animate-spin text-muted-foreground size-6' />
          </div>
        )}

        <Message
          hideThreadButton
          authorImage={message.user.image}
          body={message.body}
          createdAt={message._creationTime}
          id={message._id}
          isAuthor={message.memberId === currentMember?._id}
          image={message.image}
          isEditing={editingId === message._id}
          memberId={message.memberId}
          reactions={message.reactions}
          setEditingId={setEditingId}
          updatedAt={message.updatedAt}
          authorName={message.user.name}
        />
      </div>
      <div className='px-4'>
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          disabled={isPending}
          innerRef={editorRef}
          onCancel={() => setEditingId(null)}
          placeholder='Type a message'
        />
      </div>
    </div>
  );
};
