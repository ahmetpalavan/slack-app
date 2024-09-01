import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

interface ChannelId {
  channelId: Id<'channels'>;
}

export const useGetChannel = ({ channelId }: ChannelId) => {
  const { data, isLoading } = useQuery(convexQuery(api.channels.getById, { channelId }));
  return { data, isLoading };
};
