'use client';

import { WorkspaceSwitcher } from './workspace-switcher';

const Sidebar = () => {
  return (
    <aside className='w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4'>
      <WorkspaceSwitcher />
    </aside>
  );
};

export default Sidebar;
