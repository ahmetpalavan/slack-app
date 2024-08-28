import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

type RequestType = { id: Id<'workspaces'>; name: string };

export const useUpdateWorkspace = () => {
  const convexMutation = useConvexMutation(api.workspaces.update);

  const { mutate, isPending, mutateAsync } = useMutation({
    mutationKey: ['updateWorkspace'],
    mutationFn: (variables: RequestType) => convexMutation(variables),
    onSuccess: (data, variables) => {
      toast.success(`Workspace updated to ${variables.name}`);
    },
    onError: () => {
      toast.error('Failed to update workspace');
    },
  });

  return { mutate, isPending, mutateAsync };
};
