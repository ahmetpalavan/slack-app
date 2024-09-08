import { useMutation } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { useConvexMutation } from '@convex-dev/react-query';

export const useUpdateMember = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.members.update),
  });

  return { isPending, mutate };
};
