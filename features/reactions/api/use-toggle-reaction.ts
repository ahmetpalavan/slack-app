import { useMutation } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '~/convex/_generated/api';

export const useToggleReaction = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.reactions.toggle),
  });

  return { mutate, isPending };
};
