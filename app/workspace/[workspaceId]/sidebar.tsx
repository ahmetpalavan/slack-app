'use client';

import { Bell, Home, MessagesSquare, MoreHorizontal } from 'lucide-react';
import { SidebarButton } from './sidebar-button';
import { WorkspaceSwitcher } from './workspace-switcher';
import { UserAvatar } from '~/features/auth/components/user-avatar';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className='w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4'>
      <WorkspaceSwitcher />
      <SidebarButton icon={Home} label='Home' isActive={pathname.includes('/workspace')} />
      <SidebarButton icon={MessagesSquare} label='DMs' isActive={pathname.includes('/dms')} />
      <SidebarButton icon={Bell} label='Activity' isActive={pathname.includes('/activity')} />
      <SidebarButton icon={MoreHorizontal} label='More' isActive={pathname.includes('/more')} />
      <div className='flex items-center justify-center gap-y-1 mt-auto'>
        <UserAvatar />
      </div>
    </aside>
  );
};
