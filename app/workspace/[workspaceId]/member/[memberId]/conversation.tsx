import React from 'react';
import { Id } from '~/convex/_generated/dataModel';
import { useMemberId } from '~/hooks/use-member-id';
import { useGetMember } from '~/features/members/api/use-get-member';
import { useGetMessages } from '~/features/messages/api/use-get-messages';
import { Loader2 } from 'lucide-react';
import { Header } from './header';
import { ChatInput } from './chat-input';
import { MessageList } from '~/components/message-list';

interface ConversationProps {
  id: Id<'conversations'>;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();

  const { data, isLoading: loadingMember } = useGetMember({ id: memberId });
  const {
    results,
    status,
    isLoading: loadingMessages,
    loadMore,
  } = useGetMessages({
    conversationId: id,
  });

  if (loadingMember || status === 'LoadingFirstPage') {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='animate-spin size-6 text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <Header memberImage={data?.user.image} memberName={data?.user.name} onClick={() => {}} />
      <MessageList
        messages={results}
        variant='conversation'
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
        memberImage={data?.user.image}
        memberName={data?.user.name}
      />
      <ChatInput placeholder={`Message ${data?.user.name}`} conversationId={id} />
    </div>
  );
};
