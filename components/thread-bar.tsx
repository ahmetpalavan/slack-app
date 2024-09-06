import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ChevronRight } from 'lucide-react';

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: number;
  name?: string;
  onClick?: () => void;
}

export const ThreadBar = ({ count, image, timestamp, onClick, name = 'Member' }: ThreadBarProps) => {
  if (!count || !image || !timestamp) {
    return null;
  }

  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <button
      onClick={onClick}
      className='p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group transition max-w-[600px]'
    >
      <div className='flex items-center gap-2 overflow-hidden'>
        <Avatar className='size-6 shrink-0'>
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className='text-xs text-sky-600 hover:underline font-bold truncate'>
          {count} {count === 1 ? 'reply' : 'replies'}
        </span>
        <span className='text-xs text-muted-foreground truncate group-hover:hidden block'>
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span className='text-xs text-muted-foreground truncate group-hover:block hidden'>View replies</span>
      </div>
      <ChevronRight className='size-4 text-muted-foreground ml-auto items-center gap-2 group-hover:flex hidden' />
    </button>
  );
};
