import { Id } from '~/convex/_generated/dataModel';
import { useParams } from 'next/navigation';

export const useWorkspaceId = (): Id<'workspaces'> => {
  const params = useParams();
  return params.workspaceId as Id<'workspaces'>;
};
