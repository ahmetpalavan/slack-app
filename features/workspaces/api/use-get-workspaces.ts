import { useQuery } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { convex } from '~/provider/convex-client-provider';

export const useGetWorkspaces = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => convex.query(api.workspaces.get),
  });

  return {
    data,
    isLoading,
  };
};
