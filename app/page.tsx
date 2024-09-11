'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { UserAvatar } from '~/features/auth/components/user-avatar';
import { useGetWorkspaces } from '~/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspacesModal } from '~/features/workspaces/store/use-create-workspaces-modal';

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaces();
  const { open, isOpen } = useCreateWorkspacesModal();

  const workspacesId = useMemo(() => {
    if (!data) return [];
    return data?.[0]?._id;
  }, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspacesId) {
      router.push(`/workspace/${workspacesId}`);
    } else {
      open();
    }
  }, [workspacesId, isOpen, open, router, isLoading]);

  return (
    <div className='h-full flex items-center justify-center bg-[#5C3B58]'>
      <div className='md:h-auto flex justify-center md:w-[420px]'>
        <UserAvatar />
      </div>
    </div>
  );
}
