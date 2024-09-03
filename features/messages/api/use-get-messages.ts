import { usePaginatedQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

interface UseGetMessages {
  channelId?: Id<'channels'>;
  parentMessageId?: Id<'messages'>;
  conversationId?: Id<'conversations'>;
}

const BATCH_SIZE = 20;

export type GetMessagesReturnType = (typeof api.messages.get._returnType)['page'];

export const useGetMessages = ({ channelId, conversationId, parentMessageId }: UseGetMessages) => {
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.messages.get,
    {
      channelId,
      conversationId,
      parentMessageId,
    },
    {
      initialNumItems: BATCH_SIZE,
    }
  );

  return {
    isLoading,
    loadMore: () => loadMore(BATCH_SIZE),
    results,
    status,
  };
};
