import { api } from '~/convex/_generated/api';
import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';

export const useCurrentUser = () => {
  const { data, isLoading } = useQuery(convexQuery(api.users.current, {}));

  return {
    user: data,
    isLoading,
  };
};
