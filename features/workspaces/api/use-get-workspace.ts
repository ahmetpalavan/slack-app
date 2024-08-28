import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

interface Args {
  id: Id<'workspaces'>;
}

export const useGetWorkspace = (args: Args) => {
  const { data, isLoading, isError } = useQuery(convexQuery(api.workspaces.getById, { id: args.id }));

  return { data, isError, isLoading };
};
