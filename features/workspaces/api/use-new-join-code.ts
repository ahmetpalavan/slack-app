import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';

export const useNewJoinCode = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.newJoinCode),
  });

  return { mutate, isPending };
};
