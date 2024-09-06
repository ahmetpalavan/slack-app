import { useMutation } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '~/convex/_generated/api';

export const useCreateOrGetConversation = () => {
  const { mutate, isPending, data } = useMutation({
    mutationFn: useConvexMutation(api.conversations.createOrGetConversation),
  });

  return { mutate, isPending, data };
};
