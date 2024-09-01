import { useMutation } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '~/convex/_generated/api';

export const useUpdateChannel = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.channels.update),
  });

  return { mutate, isPending };
};
