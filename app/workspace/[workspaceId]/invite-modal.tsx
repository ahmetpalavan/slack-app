import { Copy, RefreshCcw } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useNewJoinCode } from '~/features/workspaces/api/use-new-join-code';
import { useConfirm } from '~/hooks/use-confirm';
import { useWorkspaceId } from '~/hooks/use-workspace-id';

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({ joinCode, name, open, setOpen }: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This will invalidate the current code');
  const { isPending, mutate } = useNewJoinCode();

  const generateCode = useCallback(async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    }
    mutate(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success('New code generated');
        },
        onError: () => {
          toast.error('Failed to generate new code');
        },
      }
    );
  }, [workspaceId, confirm, mutate]);

  const handleCopy = useCallback(() => {
    const url = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  }, [joinCode, workspaceId]);

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogDescription>
            Share the following link with your team to invite them to <span className='font-bold'>{name}</span>
          </DialogDescription>
          <div className='flex flex-col items-center justify-center gap-y-4 py-10'>
            <p className='text-4xl font-bold tracking-widest uppercase'>{joinCode}</p>
            <Button onClick={handleCopy}>
              Copy
              <Copy className='size-4 ml-2' />
            </Button>
          </div>

          <div className='flex justify-between items-center w-full'>
            <Button variant='default' onClick={generateCode} disabled={isPending}>
              New Code
              <RefreshCcw className='size-4 ml-2' />
            </Button>
            <Button variant='secondary' onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
