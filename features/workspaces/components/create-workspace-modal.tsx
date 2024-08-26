'use client';

import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { useCreateWorkspacesModal } from '../store/use-create-workspaces-modal';
import { useCreateWorkspace } from '../api/use-create-workspace';
import { useCallback } from 'react';

export default function CreateWorkspaceModal() {
  const { isOpen, close } = useCreateWorkspacesModal();
  const { mutate } = useCreateWorkspace();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await mutate(
        { name: 'data' },
        {
          onSuccess: () => {
            console.log('success');
          },
          onError: () => {
            console.log('error');
          },
          onSettled: () => {
            console.log('settled');
          },
        }
      );
      close();
    },
    [mutate, close]
  );

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
          <DialogDescription>Workspaces are where you collaborate with your team.</DialogDescription>
        </DialogHeader>
        <form className='space-y-4'>
          <Input value='' disabled={false} required autoFocus minLength={3} placeholder='Workspace name' />
          <div className='flex justify-end'>
            <Button type='submit' variant='default'>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
