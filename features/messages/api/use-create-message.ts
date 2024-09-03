import { api } from '~/convex/_generated/api';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { Id } from '~/convex/_generated/dataModel';

type RequestType = {
  body: string;
  workspaceId: Id<'workspaces'>;
  image?: Id<'_storage'>;
  channelId?: Id<'channels'>;
  parentMessageId?: Id<'messages'>;
  conversationId?: Id<'conversations'>;
};

export const useCreateMessage = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.messages.create),
  });

  return { mutate, isPending };
};
