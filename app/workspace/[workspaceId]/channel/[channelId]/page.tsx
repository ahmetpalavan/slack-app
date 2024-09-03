'use client';

import { Loader2, TriangleAlert } from 'lucide-react';
import { useGetChannel } from '~/features/channels/api/use-get-channel';
import { useGetMessages } from '~/features/messages/api/use-get-messages';
import { useChannelId } from '~/hooks/use-channel-id';
import { ChatInput } from './chat-input';
import { Header } from './header';
import { MessageList } from '~/components/message-list';

const ChannelId = () => {
  const channelId = useChannelId();

  const { results, status, isLoading, loadMore } = useGetMessages({ channelId });
  console.log({ results });
  const { data: channel, isLoading: channelLoading } = useGetChannel({ channelId });

  if (channelLoading || status === 'LoadingFirstPage') {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className='flex flex-col flex-1 gap-y-2 items-center justify-center h-full'>
        <TriangleAlert className='size-6 text-muted-foreground' />
        <div className='text-muted-foreground'>Channel not found</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <Header title={channel.name} />
      <MessageList
        messages={results}
        canLoadMore={status === 'CanLoadMore'}
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        loadMore={loadMore}
        isLoadingMore={status === 'CanLoadMore'}
      />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
};

export default ChannelId;
