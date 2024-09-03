import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Id } from '~/convex/_generated/dataModel';
import { useCreateMessage } from '~/features/messages/api/use-create-message';
import { useGenerateUploadUrl } from '~/features/upload/api/use-generate-upload-url';
import { useChannelId } from '~/hooks/use-channel-id';
import { useWorkspaceId } from '~/hooks/use-workspace-id';

const Editor = dynamic(() => import('~/components/editor'), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  channelId: Id<'channels'>;
  workspaceId: Id<'workspaces'>;
  body: string;
  image: Id<'_storage'> | undefined;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState<number>(0);
  const editorRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: createMessage, isPending: messagePending } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const handleSubmit = useCallback(async ({ body, image }: { body: string; image: File | null }) => {
    try {
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        body,
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

  return (
    <div className='px-5 w-full'>
      <Editor key={editorKey} onSubmit={handleSubmit} disabled={messagePending} innerRef={editorRef} placeholder={placeholder} />
    </div>
  );
};
