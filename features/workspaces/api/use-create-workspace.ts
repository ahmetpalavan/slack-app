import { useMutation } from 'convex/react';
import { useCallback } from 'react';
import { api } from '~/convex/_generated/api';

type RequestType = any;
type ResponseType = any;

type Options = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export function useCreateWorkspace() {
  const mutation = useMutation(api.workspaces.create);

  const mutate = useCallback(
    async (data: RequestType, options?: Options) => {
      try {
        const res = await mutation(data);
        options?.onSuccess?.();
      } catch (error) {
        options?.onError?.();
      } finally {
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate };
}
