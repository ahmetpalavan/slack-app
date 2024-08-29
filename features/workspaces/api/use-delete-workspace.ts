import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

type RequestType = { id: Id<'workspaces'> };

export const useDeleteWorkspace = () => {
  const convexMutation = useConvexMutation(api.workspaces.remove);

  const { mutate, isPending } = useMutation({
    mutationFn: async (variables: RequestType) => {
      return await convexMutation(variables);
    },
  });

  return { mutate, isPending };
};
