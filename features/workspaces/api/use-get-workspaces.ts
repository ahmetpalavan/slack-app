import { api } from '~/convex/_generated/api';
import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';

export const useGetWorkspaces = () => {
  const { data, isLoading } = useQuery(convexQuery(api.workspaces.get, {}));

  return {
    data,
    isLoading,
  };
};
