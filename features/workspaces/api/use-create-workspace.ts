import { useConvexMutation } from '@convex-dev/react-query';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

type RequestType = { name: string };
type ResponseType = Id<'workspaces'> | null;

export function useCreateWorkspace() {
  const router = useRouter();
  const queryClient = new QueryClient();

  const { data, mutate, isPending, error, isError, isSuccess } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.create),
    onSuccess: (res: ResponseType) => {
      toast.success('Workspace created');
      router.push(`/workspace/${res}`);
    },
    onError: (error: Error) => {
      toast.error('Failed to create workspace');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['getWorkspace'],
      });
    },
  });

  return { data, mutate, isPending, error, isError, isSuccess };
}
