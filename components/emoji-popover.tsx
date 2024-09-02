import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { useCallback, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface EmojiPopoverProps {
  onEmojiSelect: (emoji: any) => void;
  hint?: string;
  children: React.ReactNode;
}

export const EmojiPopover = ({ onEmojiSelect, hint = 'Emoji', children }: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const handleSelect = useCallback(
    (emoji: any) => {
      onEmojiSelect(emoji);
      setPopoverOpen(false);

      setTimeout(() => {
        setTooltipOpen(false);
      }, 100);
    },
    [onEmojiSelect]
  );

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent>
            <p className='text-sm text-white bg-black border border-gray-500/10'>{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className='p-0 rounded-full w-full border-none shadow-none'>
          <EmojiPicker emojiStyle={EmojiStyle.APPLE} theme={Theme.DARK} onEmojiClick={handleSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
