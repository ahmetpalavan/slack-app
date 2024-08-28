import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface HintProps {
  label: string;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const Hint = ({ children, label, align, side }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className='bg-[#171c26] text-white text-xs font-bold px-2 py-1 rounded-md' align={align} side={side}>
          <p className='m-0 font-medium text-xs'>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
