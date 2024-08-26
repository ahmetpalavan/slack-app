'use client';

import { useEffect, useMemo } from 'react';
import { UserAvatar } from '~/features/auth/components/user-avatar';
import { useGetWorkspaces } from '~/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspacesModal } from '~/features/workspaces/store/use-create-workspaces-modal';

export default function Home() {
  const { data, isLoading } = useGetWorkspaces();
  console.log('🚀 ~ Home ~ data:', data);
  const { open, isOpen } = useCreateWorkspacesModal();

  const workspacesId = useMemo(() => {
    if (!data) return [];
    return data?.[0]?._id;
  }, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspacesId) {
      console.log('workspacesId', workspacesId);
    } else if (!isOpen) {
      open();
    }
  }, [workspacesId, isLoading, isOpen, open]);

  return (
    <div className='h-full flex items-center justify-center bg-[#5C3B58]'>
      <div className='md:h-auto flex justify-center md:w-[420px]'>
        <UserAvatar />
      </div>
    </div>
  );
}
