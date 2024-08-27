'use client';

import { Info, Search } from 'lucide-react';
import React from 'react';
import { Button } from '~/components/ui/button';
import { useGetWorkspace } from '~/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '~/hooks/use-workspace-id';

const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  return (
    <nav className='bg-[#481349] flex items-center justify-between h-10 p-1.5'>
      <div className='flex-1' />
      <div className='min-w-[200px] max-[642px] grow-[2] shrink'>
        <Button className='mr-2 bg-accent/25 hover:bg-accent-25 w-full flex justify-start' size='sm'>
          <Search className='w-4 h-4' />
          <span className='ml-2'>Search {data?.name}</span>
        </Button>
      </div>
      <div className='ml-auto flex-1 items-center flex justify-end'>
        <Button variant='transparent' size='iconSm'>
          <Info className='w-4 h-4' />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
