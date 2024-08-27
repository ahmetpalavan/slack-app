import { useMutation } from 'convex/react';
import { useCallback, useMemo, useState } from 'react';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

type RequestType = { name: string };
type ResponseType = Id<'workspaces'> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export function useCreateWorkspace() {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'pending' | 'success' | 'error' | 'settled' | null>(null);

  const isPending = useMemo(() => status === 'pending', [status]);
  const isSuccess = useMemo(() => status === 'success', [status]);
  const isError = useMemo(() => status === 'error', [status]);
  const isSettled = useMemo(() => status === 'settled', [status]);

  const mutation = useMutation(api.workspaces.create);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus('pending');

        const res = await mutation(values);
        options?.onSuccess?.(res);
        setData(res);
        return res;
      } catch (error) {
        options?.onError?.(error as Error);

        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus('settled');
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, isPending, isSuccess, isError, isSettled, data, error };
}
