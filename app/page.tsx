'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '~/components/ui/button';

export default function Home() {
  const { signOut } = useAuthActions();
  return (
    <div className='h-full flex items-center justify-center bg-[#5C3B58]'>
      <div className='md:h-auto flex justify-center md:w-[420px]'>
        <Button onClick={signOut} size='lg' variant='default' className='w-full'>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
