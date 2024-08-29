import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

interface GetChannelsArgs {
  workspaceId: Id<'workspaces'>;
}

export const useGetChannels = (args: GetChannelsArgs) => {
  const { data, isLoading } = useQuery(convexQuery(api.channels.get, args));
  return { data, isLoading };
};
