import { QueryClient } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { useDeleteWorkspace } from '~/features/workspaces/api/use-delete-workspace';
import { useUpdateWorkspace } from '~/features/workspaces/api/use-update-workspace';
import { useWorkspaceId } from '~/hooks/use-workspace-id';

interface Props {
  initialValue?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export const PreferenceModal = ({ initialValue, open, setOpen }: Props) => {
  const id = useWorkspaceId();
  const [value, setValue] = useState<string>(initialValue || '');
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const router = useRouter();

  const { mutate, isPending, mutateAsync } = useUpdateWorkspace();
  const { isPending: pendingWorkspace, mutate: deleteWorkspace } = useDeleteWorkspace();

  const handleEdit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (value === initialValue) {
        setEditOpen(false);
        return;
      }
      await mutateAsync({ id, name: value });
      setEditOpen(false);
    },
    [id, value, initialValue, mutateAsync]
  );

  const handleDelete = useCallback(async () => {
    await deleteWorkspace(
      { id },
      {
        onSuccess: () => {
          toast.success('Workspace deleted');
          router.replace('/');
        },
        onError: () => {
          toast.error('Failed to delete workspace');
        },
      }
    );
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
        <DialogHeader className='p-4 border-b bg-white'>
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>
        <div className='px-4 pb-4 flex flex-col gap-y-2'>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-100'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-medium text-muted-foreground'>Workspace name</p>
                  <p className='text-sm font-medium text-[#1264a3] hover:underline'>Edit</p>
                </div>
                <p className='text-sm font-medium'>{value}</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit workspace name</DialogTitle>
              </DialogHeader>
              <form className='space-y-4' onSubmit={handleEdit}>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder='Workspace name'
                  required
                  autoFocus
                  minLength={3}
                  maxLength={50}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant='outline' onClick={() => setEditOpen(false)}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button>Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <button
            onClick={handleDelete}
            disabled={pendingWorkspace}
            className='flex items-center gap-x-2 group px-5 py-4 rounded-lg bg-white hover:bg-red-50 text-rose-800'
          >
            <TrashIcon className='size-4 ' />
            <span className='text-sm font-medium'>Delete workspace</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
