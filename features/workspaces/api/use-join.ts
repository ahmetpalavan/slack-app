import { useMutation } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '~/convex/_generated/api';

export const useJoin = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.join),
  });

  return { mutate, isPending };
};
