'use client';

import { ConvexQueryClient } from '@convex-dev/react-query';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { convex } from './convex-client-provider';

const convexQueryClient = new ConvexQueryClient(convex);

function makeQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });
  convexQueryClient.connect(queryClient);
  return queryClient;
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
