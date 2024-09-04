import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
import { useState } from 'react';
import { Id } from '~/convex/_generated/dataModel';
import { GetMessagesReturnType } from '~/features/messages/api/use-get-messages';
import { ChannelHero } from './channel-hero';
import { Message } from './message';
import { useWorkspaceId } from '~/hooks/use-workspace-id';
import { useCurrentMember } from '~/features/members/api/use-current-member';
import { Loader2 } from 'lucide-react';

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: 'channel' | 'thread' | 'conversation';
  messages: GetMessagesReturnType | undefined | null;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const TIME_THRESHOLD = 5;

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

export const MessageList = ({
  messages,
  loadMore,
  isLoadingMore,
  canLoadMore,
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant = 'channel',
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useCurrentMember({ workspaceId });
  const groupMessages = messages?.reduce(
    (acc, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].unshift(message);

      return acc;
    },
    {} as Record<string, typeof messages>
  );

  return (
    <div className='flex flex-col-reverse messages-scrollbar pb-4 flex-1 overflow-y-auto'>
      {Object.entries(groupMessages || {}).map(([date, messages]) => (
        <div key={date}>
          <div className='text-center my-2 relative'>
            <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300' />
            <span className='relative inline-block px-4 py-1 bg-white text-gray-500 text-sm font-semibold'>{formatDateLabel(date)}</span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
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
                isAuthor={message.memberId === data?._id}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={false}
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
        <div className='text-center my-2 relative'>
          <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300' />
          <span className='relative inline-block px-4 py-1 bg-white text-gray-500 text-xs font-semibold'>
            <Loader2 className='size-4 animate-spin' />
          </span>
        </div>
      )}
      {variant === 'channel' && channelName && channelCreationTime && <ChannelHero name={channelName} creationTime={channelCreationTime} />}
    </div>
  );
};
