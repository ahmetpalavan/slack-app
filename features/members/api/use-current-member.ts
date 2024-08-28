import { useQuery } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { convexQuery } from '@convex-dev/react-query';
interface Args {
  workspaceId: Id<'workspaces'>;
}

export const useCurrentMember = (args: Args) => {
  const { data, isLoading } = useQuery(convexQuery(api.members.current, args));

  return { data, isLoading };
};
