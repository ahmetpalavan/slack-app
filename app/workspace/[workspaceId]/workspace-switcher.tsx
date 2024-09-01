'use client';

import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { useGetWorkspace } from '~/features/workspaces/api/use-get-workspace';
import { useGetWorkspaces } from '~/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspacesModal } from '~/features/workspaces/store/use-create-workspaces-modal';
import { useWorkspaceId } from '~/hooks/use-workspace-id';

export const WorkspaceSwitcher = () => {
  const { open } = useCreateWorkspacesModal();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  const filtredWorkspaces = workspaces?.filter((w) => w._id !== workspaceId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='size-9 relative overflow-hidden bg-[#ABABAB] hover:bg-[#ABABAB]/80 text-slate-900 font-bold'>
          {workspaceLoading ? <Loader2 className='size-6 shrink-0 animate-spin' /> : workspace?.name.charAt(0).toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='start' className='w-60'>
        <DropdownMenuItem
          className='cursor-pointer flex-col justify-start items-start capitalize'
          onClick={() => {
            router.push(`/workspace/${workspaceId}`);
          }}
        >
          {workspace?.name}
          <span className='text-xs text-muted-foreground'>Active workspace</span>
        </DropdownMenuItem>
        {filtredWorkspaces?.map((w) => (
          <DropdownMenuItem
            key={w._id}
            className='cursor-pointer capitalize overflow-hidden'
            onClick={() => {
              router.push(`/workspace/${w._id}`);
            }}
          >
            <div className='w-8 h-8 mr-2 shrink-0 rounded-md flex items-center justify-center bg-[#ABABAB] text-slate-900 font-bold'>
              {w.name.charAt(0).toUpperCase()}
            </div>
            <p className='truncate'>{w.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className='cursor-pointer capitalize'
          onClick={() => {
            open();
          }}
        >
          <Plus className='size-8 mr-2 bg-[#F2F2F2] text-slate-800 text-lg rounded-md flex items-center justify-center font-bold' />
          Create new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
