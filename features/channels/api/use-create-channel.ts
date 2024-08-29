import { useMutation } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

type RequestType = {
  name: string;
  workspaceId: Id<'workspaces'>;
};

type ResponseType = {
  _id: Id<'channels'> | null;
};

export const useCreateChannel = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.channels.create),
  });

  return { mutate, isPending };
};
