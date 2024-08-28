import { Loader2, TriangleAlert } from 'lucide-react';
import React from 'react';
import { useCurrentMember } from '~/features/members/api/use-current-member';
import { useGetWorkspace } from '~/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '~/hooks/use-workspace-id';
import { WorkspaceHeader } from './index';

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isError, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

  if (memberLoading || workspaceLoading) {
    return (
      <div className='flex items-center bg-[#5e2c5f] flex-col justify-center h-full'>
        <Loader2 className='size-5 animate-spin text-white' />
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
    </div>
  );
};
