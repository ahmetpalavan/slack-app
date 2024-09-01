import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

interface UseGetWorkspaceInfo {
  id: Id<'workspaces'>;
}

export const useGetWorkspaceInfo = ({ id }: UseGetWorkspaceInfo) => {
  const { data, isLoading } = useQuery(convexQuery(api.workspaces.getInfoById, { id }));

  return { data, isLoading };
};
