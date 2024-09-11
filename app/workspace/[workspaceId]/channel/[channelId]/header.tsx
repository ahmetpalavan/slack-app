import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { useDeleteChannel } from '~/features/channels/api/use-delete-channel';
import { useUpdateChannel } from '~/features/channels/api/use-update-channel';
import { useCurrentMember } from '~/features/members/api/use-current-member';
import { useChannelId } from '~/hooks/use-channel-id';
import { useConfirm } from '~/hooks/use-confirm';
import { useWorkspaceId } from '~/hooks/use-workspace-id';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const [value, setValue] = useState<string>(title);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, onConfirm] = useConfirm('Delete channel', 'Are you sure you want to delete this channel?');

  const { mutate: updateChannel, isPending: pendingUpdate } = useUpdateChannel();
  const { mutate: deleteChannel, isPending: pendingDelete } = useDeleteChannel();
  const { data, isLoading } = useCurrentMember({ workspaceId });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
    setValue(value);
  }, []);

  const handleOpen = useCallback(
    (value: boolean) => {
      if (data?.role !== 'admin') return;
      setEditOpen(value);
    },
    [data?.role]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      updateChannel(
        { channelId, name: value },
        {
          onSuccess: () => {
            setEditOpen(false);
            toast.success('Channel updated');
          },
          onError: () => {
            toast.error('Failed to update channel');
          },
        }
      );
    },
    [updateChannel, value, channelId]
  );

  const handleDelete = useCallback(async () => {
    const confirmed = await onConfirm();
    if (confirmed) {
      deleteChannel(
        { channelId },
        {
          onSuccess: () => {
            router.push(`/workspace/${workspaceId}`);
            toast.success('Channel deleted');
          },
          onError: () => {
            toast.error('Failed to delete channel');
          },
        }
      );
    }
  }, [deleteChannel, onConfirm, channelId, workspaceId, router]);

  return (
    <>
      <ConfirmDialog />
      <div className='flex items-center px-6 py-3 border-b border-gray-200'>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-x-1 w-auto' variant='ghost' size='iconSm'>
              <span className='text-muted-foreground text-sm font-semibold'># {title}</span>
              <FaChevronDown className='text-muted-foreground size-2.5' />
            </Button>
          </DialogTrigger>
          <DialogContent className='p-0'>
            <DialogHeader className='p-4 text-lg font-semibold'>
              <DialogTitle># {title}</DialogTitle>
            </DialogHeader>
            <div className='px-4 pb-4 flex flex-col gap-y-2'>
              <Dialog open={editOpen} onOpenChange={handleOpen}>
                <DialogTrigger asChild>
                  <div className='px-5 py-4 bg-white rounded-md shadow-md hover:bg-gray-50'>
                    <div className='flex justify-between items-center'>
                      <p className='text-sm font-semibold text-muted-foreground'>Channel name</p>
                      {data?.role === 'admin' && (
                        <p
                          className='text-sm font-semibold text-[#1264a3] cursor-pointer
                    hover:text-[#0d5985]'
                        >
                          Edit
                        </p>
                      )}
                    </div>
                    <p className='text-sm text-muted-foreground'># {title}</p>
                  </div>
                </DialogTrigger>
                <DialogContent className='p-2'>
                  <DialogHeader className='p-4 text-lg font-semibold'>
                    <DialogTitle>Edit channel</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className='flex flex-col gap-y-4'>
                    <Input
                      required
                      disabled={pendingUpdate}
                      minLength={3}
                      maxLength={100}
                      placeholder='Channel name'
                      value={value}
                      onChange={handleChange}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant='destructive' size='sm'>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type='submit' variant='default' size='sm'>
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {data?.role === 'admin' && (
                <button
                  onClick={handleDelete}
                  disabled={pendingDelete}
                  className='flex items-center gap-x-2 px-5 py-4 bg-white shadow-md rounded-lg cursor-pointer text-rose-600 hover:bg-gray-50'
                >
                  <TrashIcon className='size-4' />
                  <span className='text-sm font-semibold'>Delete channel</span>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
