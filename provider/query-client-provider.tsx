'use client';

import { ConvexQueryClient } from '@convex-dev/react-query';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { convex } from './convex-client-provider';

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  const convexQueryClient = new ConvexQueryClient(convex);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });
  convexQueryClient.connect(queryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
