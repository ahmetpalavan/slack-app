import { api } from '~/convex/_generated/api';
import { useMutation } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';

export const useDeleteChannel = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.channels.remove),
  });
  return { mutate, isPending };
};
