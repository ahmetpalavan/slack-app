'use client';

import { Loader2, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useGetChannels } from '~/features/channels/api/use-get-channels';
import { useCreateChannelModal } from '~/features/channels/store/use-create-channel-modal';
import { useCurrentMember } from '~/features/members/api/use-current-member';
import { useGetWorkspace } from '~/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '~/hooks/use-workspace-id';

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { isOpen, open } = useCreateChannelModal();
  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isError, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role]);

  useEffect(() => {
    if (workspaceLoading || channelsLoading || !workspace || !member || !memberLoading) return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!isOpen) {
      open();
    }
  }, [workspaceLoading, channelsLoading, workspace, channelId, isOpen, open, router, workspaceId, member, memberLoading, isAdmin]);

  if (workspaceLoading || channelsLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='size-6 text-muted-foreground animate-spin' />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className='flex items-center justify-center h-full'>
        <TriangleAlert className='size-5 text-muted-foreground' />
        <div>Workspace not found</div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center h-full space-x-2'>
      <TriangleAlert className='size-5 text-muted-foreground' />
      <span>Redirecting...</span>
    </div>
  );
};

export default WorkspaceIdPage;
