import { PlusIcon } from 'lucide-react';
import { FaCaretDown } from 'react-icons/fa';
import { useToggle } from 'react-use';
import { Hint } from '~/components/hint';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

interface WorkspaceSectionProps {
  children: React.ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
}

export const WorkspaceSection = ({ children, label, hint, onNew }: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);
  return (
    <div className='flex flex-col mt-3'>
      <div className='flex items-center px-3.5 group'>
        <Button onClick={toggle} variant='transparent' className='p-0.5 text-sm text-[#b3b5c1] shrink-0 size-6 group-hover:text-white'>
          <FaCaretDown className={cn('size-4 transition-transform', on && 'transform rotate-180')} />
        </Button>
        <Button
          variant='transparent'
          className='px-1.5 text-sm text-[#b3b5c1] h-7 group-hover:text-white justify-start overflow-hidden items-center'
        >
          <span className='truncate'>{label}</span>
        </Button>
        {onNew && (
          <Hint label={hint} align='center' side='top'>
            <Button
              variant='transparent'
              size='iconSm'
              className='opacity-0 group-hover:opacity-100 group-hover:text-white transition-opacity ml-auto p-0.5 size-6 shrink-0 text-[#b3b5c1] text-sm'
              onClick={onNew}
            >
              <PlusIcon className='size-5' />
            </Button>
          </Hint>
        )}
      </div>
      {on && <div className='flex flex-col gap-1 mt-1'>{children}</div>}
    </div>
  );
};
