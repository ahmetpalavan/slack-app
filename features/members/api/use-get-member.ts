import { useQuery } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { convexQuery } from '@convex-dev/react-query';
import { Id } from '~/convex/_generated/dataModel';

interface GetMemberProps {
  id: Id<'members'>;
}

export const useGetMember = ({ id }: GetMemberProps) => {
  const { data, isLoading } = useQuery(convexQuery(api.members.getById, { id }));

  return { data, isLoading };
};
