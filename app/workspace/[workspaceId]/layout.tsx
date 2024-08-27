'use client';

import React from 'react';
import Toolbar from './toolbar';
import Sidebar from './sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='h-full'>
      <Toolbar />
      <div className='flex h-[calc(100vh-40px)]'>
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
