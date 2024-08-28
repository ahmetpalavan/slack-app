import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

interface SidebarButtonProps {
  label: string;
  isActive?: boolean;
  icon: LucideIcon | IconType;
}

export const SidebarButton = ({ label, isActive, icon: Icon }: SidebarButtonProps) => {
  return (
    <div className='flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group'>
      <Button variant='transparent' className={cn('size-9 p-2 group-hover:bg-accent/20 rounded-md', isActive && 'bg-accent/20')} asChild>
        <Icon className='size-5 text-white group-hover:scale-110 transition-all' />
      </Button>
      <span className='text-white text-xs group-hover:text-accent'>{label}</span>
    </div>
  );
};
