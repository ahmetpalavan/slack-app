import { useQuery } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { convex } from '~/provider/convex-client-provider';

interface Args {
  id: Id<'workspaces'>;
}

export const useGetWorkspace = (args: Args) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['getWorkspace', args],
    queryFn: async () => {
      return await convex.query(api.workspaces.getById, { id: args.id });
    },
  });

  return { data, isError, isLoading };
};
