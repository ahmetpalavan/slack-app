import { api } from '~/convex/_generated/api';
import { useMutation } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';

export const useUpdateMessage = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.messages.update),
  });

  return { mutate, isPending };
};
