import { ChevronDown, ListFilter, SquarePen } from 'lucide-react';
import { Hint } from '~/components/hint';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Doc } from '~/convex/_generated/dataModel';
import { PreferenceModal } from './preference-modal';
import { useState } from 'react';
import { InviteModal } from './invite-modal';

interface WorkspaceHeaderProps {
  workspace: Doc<'workspaces'>;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openInvite, setOpenInvite] = useState<boolean>(false);
  return (
    <>
      <InviteModal name={workspace.name} joinCode={workspace.joinCode} open={openInvite} setOpen={setOpenInvite} />
      <PreferenceModal initialValue={workspace.name} open={open} setOpen={setOpen} />
      <div className='flex items-center justify-between px-4 h-12 gap-0.5'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='transparent' className='font-bold text-lg w-auto p-2 overflow-hidden'>
              <span className='truncate'>{workspace.name}</span>
              <ChevronDown className='size-4 ml-1 shrink-0' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start' className='w-64'>
            <DropdownMenuItem className='cursor-pointer capitalize'>
              <div className='size-9 relative overflow-hidden bg-[#2a419a] text-white flex justify-center items-center rounded-full'>
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className='ml-2 flex flex-col items-start'>
                <div className='font-bold'>{workspace.name}</div>
                <div className='text-xs text-muted-foreground'>Workspace</div>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpenInvite(true)} className='cursor-pointer'>
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpen(true)} className='cursor-pointer'>
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className='flex items-center gap-1'>
          <Hint label='Filter conversations' side='bottom'>
            <Button variant='transparent' size='iconSm' className='text-white'>
              <ListFilter className='size-4' />
            </Button>
          </Hint>
          <Hint label='Edit workspace' side='bottom'>
            <Button variant='transparent' size='iconSm' className='text-white'>
              <SquarePen className='size-4' />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};
