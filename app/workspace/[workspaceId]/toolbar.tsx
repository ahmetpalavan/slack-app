'use client';

import { Info, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/ui/command';
import { useGetChannels } from '~/features/channels/api/use-get-channels';
import { useGetMembers } from '~/features/members/api/use-get-members';
import { useGetWorkspace } from '~/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '~/hooks/use-workspace-id';

export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: channels, isLoading: loadingChannel } = useGetChannels({ workspaceId });
  const { data: members, isLoading: loadingMembers } = useGetMembers({ workspaceId });

  const [open, setOpen] = useState<boolean>(false);

  const onChannel = useCallback(
    (channelId: string) => {
      setOpen(false);
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    },
    [router, workspaceId]
  );

  const onMember = useCallback(
    (memberId: string) => {
      setOpen(false);
      router.push(`/workspace/${workspaceId}/member/${memberId}`);
    },
    [router, workspaceId]
  );

  return (
    <nav className='bg-[#481349] flex items-center justify-between h-10 p-1.5'>
      <div className='flex-1' />
      <div className='min-w-[200px] max-[642px] grow-[2] shrink'>
        <Button onClick={() => setOpen(true)} className='mr-2 bg-accent/25 hover:bg-accent-25 w-full flex justify-start' size='sm'>
          <Search className='w-4 h-4' />
          <span className='ml-2'>Search {data?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder='Type / to search commands' />
          <CommandList>
            <CommandEmpty>No commands found</CommandEmpty>
            <CommandGroup heading='Suggesting'>
              {channels?.map((channel) => (
                <CommandItem className='cursor-pointer' onSelect={() => onChannel(channel._id)}>
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='suggesting' title='Frequently used'>
              {members?.map((member) => (
                <CommandItem className='cursor-pointer' onSelect={() => onMember(member._id)}>
                  {member.user?.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className='ml-auto flex-1 items-center flex justify-end'>
        <Button variant='transparent' size='iconSm'>
          <Info className='w-4 h-4' />
        </Button>
      </div>
    </nav>
  );
};
