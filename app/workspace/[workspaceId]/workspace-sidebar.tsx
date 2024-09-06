import { Hash, Loader2, MessageSquareText, SendHorizonal, TriangleAlert } from 'lucide-react';
import { useGetChannels } from '~/features/channels/api/use-get-channels';
import { useCreateChannelModal } from '~/features/channels/store/use-create-channel-modal';
import { useCurrentMember } from '~/features/members/api/use-current-member';
import { useGetMembers } from '~/features/members/api/use-get-members';
import { useGetWorkspace } from '~/features/workspaces/api/use-get-workspace';
import { useChannelId } from '~/hooks/use-channel-id';
import { useMemberId } from '~/hooks/use-member-id';
import { useWorkspaceId } from '~/hooks/use-workspace-id';
import { SidebarItem, UserItem, WorkspaceHeader, WorkspaceSection } from './index';

export const WorkspaceSidebar = () => {
  const memberId = useMemberId();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { open } = useCreateChannelModal();
  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isError, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
  const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

  if (memberLoading || workspaceLoading) {
    return (
      <div className='flex items-center bg-[#5e2c5f] flex-col justify-center h-full'>
        <Loader2 className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className='flex items-center bg-[#5e2c5f] flex-col justify-center h-full'>
        <TriangleAlert className='size-5 text-white' />
        <div className='text-white'>Workspace not found</div>
      </div>
    );
  }

  return (
    <div className='flex bg-[#5e2c5f] flex-col h-full'>
      <WorkspaceHeader isAdmin={member.role === 'admin'} workspace={workspace} />
      <div className='flex flex-col px-2 mt-3 gap-1'>
        <SidebarItem variant='active' label='Threads' id={workspaceId} icon={MessageSquareText} />
        <SidebarItem icon={SendHorizonal} label='Drafts & Sent' id='dm' />
        <WorkspaceSection hint="New channels for team's topics" label='Channels' onNew={member.role === 'admin' ? open : undefined}>
          {channels?.map((channel) => (
            <SidebarItem
              key={channel._id}
              icon={Hash}
              id={channel._id}
              label={channel.name}
              variant={channelId === channel._id ? 'active' : 'default'}
            />
          ))}
        </WorkspaceSection>
        <WorkspaceSection hint='New Direct Messages' label='Direct Messages' onNew={() => {}}>
          {members?.map((member) => (
            <UserItem
              variant={member._id === memberId ? 'active' : 'default'}
              key={member._id}
              id={member._id}
              image={member.user?.image}
              label={member.user?.name}
            />
          ))}
        </WorkspaceSection>
      </div>
    </div>
  );
};
