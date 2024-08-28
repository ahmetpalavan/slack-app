import { useQuery } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { convex } from '~/provider/convex-client-provider';

interface Args {
  workspaceId: Id<'workspaces'>;
}

export const useCurrentMember = (args: Args) => {
  const { data, isLoading } = useQuery({
    queryKey: ['currentMember', args],
    queryFn: async () => {
      return await convex.query(api.members.current, { workspaceId: args.workspaceId });
    },
  });

  return { data, isLoading };
};
