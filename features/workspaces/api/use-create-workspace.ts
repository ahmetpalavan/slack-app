import { QueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { convex } from '~/provider/convex-client-provider';

type RequestType = { name: string };
type ResponseType = Id<'workspaces'> | null;

export function useCreateWorkspace() {
  const router = useRouter();
  const queryClient = new QueryClient();

  const { data, mutate, isPending, error, isError, isSuccess } = useMutation({
    mutationFn: async (args: RequestType) => {
      return await convex.mutation(api.workspaces.create, { name: args.name });
    },
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
