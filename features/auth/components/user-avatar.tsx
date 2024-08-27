'use client';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { useCurrentUser } from '../api/use-current-user';
import { Loader2, LogOut } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';

export const UserAvatar = () => {
  const { signOut } = useAuthActions();
  const { isLoading, user } = useCurrentUser();

  if (isLoading) {
    return (
      <div className='relative size-10'>
        <Loader2 className='absolute inset-0 m-auto size-4 animate-spin text-muted-foreground' />
      </div>
    );
  }
  if (!user) {
    return null;
  }

  const { name, email, image } = user;

  const avatarFallback = name?.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='outline-none relative'>
        <Avatar className='size-10 hover:opacity-75 transition'>
          {image ? (
            <AvatarImage src={image} alt={name} />
          ) : (
            <AvatarFallback className='bg-sky-500 text-white'>{avatarFallback}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center' side='right' className='w-60'>
        <DropdownMenuItem className='text-sm font-medium'>{name}</DropdownMenuItem>
        <DropdownMenuItem className='text-sm text-muted-foreground'>{email}</DropdownMenuItem>
        <DropdownMenuItem onClick={signOut} className='text-sm text-red-600 hover:text-red-700 h-10'>
          <LogOut className='size-4 mr-2' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
