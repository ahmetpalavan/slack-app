import { AlertTriangle, ChevronDownIcon, Loader2, MailIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Id } from '~/convex/_generated/dataModel';
import { useWorkspaceId } from '~/hooks/use-workspace-id';
import { useCurrentMember } from '../api/use-current-member';
import { useGetMember } from '../api/use-get-member';
import { useDeleteMember } from '../api/use-remove-member';
import { useUpdateMember } from '../api/use-update-member';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useConfirm } from '~/hooks/use-confirm';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [LeaveDialog, confirmLeave] = useConfirm(
    "Are you sure you want to leave this workspace? You won't be able to rejoin unless you are invited again.",
    'Leave Workspace'
  );

  const [RemoveDialog, confirmRemove] = useConfirm(
    'Are you sure you want to remove this member? They will no longer have access to this workspace.',
    'Remove Member'
  );

  const [RoleDialog, confirmRole] = useConfirm('Are you sure you want to change this member role?', 'Change Role');

  const { data: currentMember, isLoading: loadingCurrentMember } = useCurrentMember({ workspaceId });
  const { data: member, isLoading: loadingMember } = useGetMember({ id: memberId });

  const { mutate: deleteMember, isPending: pendingDeletingMember } = useDeleteMember();
  const { mutate: updateMember, isPending: pendingUpdatingMember } = useUpdateMember();

  const onRemove = useCallback(async () => {
    const ok = await confirmRemove();

    if (!ok) {
      return;
    }

    deleteMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success('Member removed successfully');
          onClose();
        },
        onError: () => {
          toast.error('Failed to remove member');
        },
      }
    );
  }, [deleteMember, memberId]);

  const onLeave = useCallback(async () => {
    const ok = await confirmLeave();

    if (!ok) {
      return;
    }

    deleteMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace('/');
          toast.success('Left workspace successfully');
          onClose();
        },
        onError: () => {
          toast.error('Failed to leave workspace');
        },
      }
    );
  }, [deleteMember, memberId]);

  const onRoleChange = useCallback(
    async (role: 'admin' | 'member') => {
      const ok = await confirmRole();

      if (!ok) {
        return;
      }
      updateMember(
        { id: memberId, role },
        {
          onSuccess: () => {
            toast.success('Role updated successfully');
            onClose();
          },
          onError: () => {
            toast.error('Failed to update role');
          },
        }
      );
    },
    [updateMember, memberId]
  );

  if (loadingMember) {
    return (
      <div className='flex justify-center items-center h-full'>
        <Loader2 className='animate-spin text-muted-foreground size-6' />
      </div>
    );
  }

  if (!member) {
    return (
      <div className='flex flex-col h-full'>
        <div className='flex justify-between items-center p-4 border-b'>
          <p className='text-lg font-bold'>Thread</p>
          <Button onClick={onClose} className='text-muted-foreground hover:text-white'>
            <XIcon className='size-5' />
          </Button>
        </div>
        <div className='flex flex-col gap-y-2 justify-center items-center h-full'>
          <AlertTriangle className='text-muted-foreground size-8' />
          <p className='text-lg text-muted-foreground'>Message not found</p>
        </div>
      </div>
    );
  }

  const fallback = member.user.name?.charAt(0).toUpperCase() ?? 'M';

  return (
    <>
      <RoleDialog />
      <LeaveDialog />
      <RemoveDialog />
      <div className='h-full flex-col flex'>
        <div className='flex justify-between items-center px-6 py-3  border-b'>
          <p className='text-lg font-bold'>Thread</p>
          <Button size='iconSm' variant='ghost' onClick={onClose} className='text-muted-foreground hover:text-white'>
            <XIcon className='size-5' />
          </Button>
        </div>
        <div className='flex flex-col justify-center items-center p-4'>
          <Avatar className='max-w-[256px] max-h-[256px] rounded-md size-full'>
            <AvatarImage src={member.user.image} />
            <AvatarFallback className='aspect-square bg-sky-500 text-white text-6xl rounded-md'>{fallback}</AvatarFallback>
          </Avatar>
        </div>
        <div className='flex flex-col p-4'>
          <span className='text-lg font-bold'>{member.user.name}</span>
          {currentMember?.role === 'admin' && currentMember._id !== member._id ? (
            <div className='flex items-center gap-4 mt-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='w-full capitalize'>
                    {member.role} <ChevronDownIcon className='size-4 ml-2' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={member.role} onValueChange={(value) => onRoleChange(value as 'admin' | 'member')}>
                    <DropdownMenuRadioItem value='admin'>Admin</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='member'>Member</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={onRemove} variant='destructive' className='w-full capitalize'>
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId && currentMember.role !== 'admin' ? (
            <div>
              <Button onClick={onLeave} variant='destructive' className='w-full capitalize'>
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className='flex flex-col p-4'>
          <p className='text-sm text-muted-foreground mb-4'>Contact Information</p>
          <div className='flex items-center gap-2'>
            <div className='size-9 rounded-md bg-muted flex items-center justify-center'>
              <MailIcon className='size-4 text-muted-foreground' />
            </div>
            <div className='flex flex-col'>
              <p className='text-sm font-semibold text-muted-foreground'>Email Adress</p>
              <Link className='text-sm hover:underline text-[#1264a3]' href={`mailto:${member.user.email}`}>
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
