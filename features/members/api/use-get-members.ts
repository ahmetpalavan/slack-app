import { useQuery } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { convexQuery } from '@convex-dev/react-query';

interface Args {
  workspaceId: Id<'workspaces'>;
}

export const useGetMembers = (args: Args) => {
  const { data, isLoading } = useQuery(convexQuery(api.members.get, args));

  return { data, isLoading };
};
