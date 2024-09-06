import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

interface UseGetMessage {
  id: Id<'messages'>;
}

export const useGetMessage = ({ id }: UseGetMessage) => {
  const { data, isLoading } = useQuery(convexQuery(api.messages.getById, { id }));

  return { data, isLoading };
};
