import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useCreateChannelModal } from '../store/use-create-channel-modal';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useCallback, useState } from 'react';
import { useCreateChannel } from '../api/use-create-channel';
import { useWorkspaceId } from '~/hooks/use-workspace-id';

export const CreateChannelModal = () => {
  const { isOpen, close } = useCreateChannelModal();
  const workspaceId = useWorkspaceId();
  const [name, setName] = useState<string>('');
  const { mutate, isPending } = useCreateChannel();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '-').toLowerCase();
    setName(value);
  }, []);

  const handleClose = useCallback(() => {
    close();
    setName('');
  }, [close]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      mutate({ name, workspaceId });
      setName('');
      close();
    },
    [mutate, name]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a channel</DialogTitle>
          <DialogDescription>
            Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 space-y-4'>
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder='e.g. plan-budget'
          />
          <div className='flex justify-end'>
            <Button disabled={isPending} type='submit'>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
