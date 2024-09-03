import { MessageSquareTextIcon, Pencil, Smile, Trash } from 'lucide-react';
import { EmojiPopover } from './emoji-popover';
import { Hint } from './hint';
import { Button } from './ui/button';

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleDelete: () => void;
  handleThread: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const Toolbar = ({
  handleDelete,
  handleEdit,
  handleThread,
  hideThreadButton,
  isAuthor,
  isPending,
  handleReaction,
}: ToolbarProps) => {
  return (
    <div className='absolute top-0 right-5'>
      <div className='group-hover:opacity-100 opacity-0 transition-opacitiy border bg-white rounded-md shadow-md'>
        <EmojiPopover onEmojiSelect={(emoji) => handleReaction(emoji.native)} hint='React'>
          <Button variant='ghost' size='iconSm' disabled={isPending}>
            <Smile className='size-4' />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label='Thread'>
            <Button variant='ghost' size='iconSm' disabled={isPending} onClick={handleThread} hidden={hideThreadButton}>
              <MessageSquareTextIcon className='size-4' />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label='Edit'>
            <Button variant='ghost' size='iconSm' disabled={isPending} onClick={handleEdit}>
              <Pencil className='size-4' />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label='Delete'>
            <Button variant='ghost' size='iconSm' disabled={isPending} onClick={handleDelete}>
              <Trash className='size-4' />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};
