import { useMutation } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '~/convex/_generated/api';

export const useDeleteMessage = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.messages.remove),
  });

  return { mutate, isPending };
};
