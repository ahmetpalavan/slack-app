'use client';

import { Loader2, TriangleAlert } from 'lucide-react';
import React from 'react';
import { useGetChannel } from '~/features/channels/api/use-get-channel';
import { useChannelId } from '~/hooks/use-channel-id';
import { Header } from './header';
import { ChatInput } from './chat-input';

const ChannelId = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannel({ channelId });

  if (channelLoading) {
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
      <div className='flex-1' />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
};

export default ChannelId;
