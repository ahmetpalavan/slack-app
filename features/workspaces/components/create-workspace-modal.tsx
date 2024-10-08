'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { useCreateWorkspace } from '../api/use-create-workspace';
import { useCreateWorkspacesModal } from '../store/use-create-workspaces-modal';
import { toast } from 'sonner';

export default function CreateWorkspaceModal() {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const { isOpen, close } = useCreateWorkspacesModal();
  const { mutate, isPending } = useCreateWorkspace();

  const handleClose = useCallback(() => {
    close();
    setName('');
  }, [close]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!name) return;
      mutate(
        { name },
        {
          onSuccess: () => {
            handleClose();
          },
          onError: () => {
            toast.error('Failed to create workspace');
          },
        }
      );
    },
    [mutate, close, name, router]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
          <DialogDescription>Workspaces are where you collaborate with your team.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            value={name}
            onChange={(e) => {
              console.log(e.target.value);
              setName(e.target.value);
            }}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder='Workspace name'
          />
          <div className='flex justify-end'>
            <Button type='submit' disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
