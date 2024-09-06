'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable';
import { Id } from '~/convex/_generated/dataModel';
import { Thread } from '~/features/messages/components/thread';
import { usePanel } from '~/hooks/use-panel';
import { Sidebar, Toolbar } from './index';
import { WorkspaceSidebar } from './workspace-sidebar';
import { Profile } from '~/features/members/components/profile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { parentMessageId, closeParentMessage, profileMemberId } = usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  return (
    <div className='h-full'>
      <Toolbar />
      <div className='flex h-[calc(100vh-40px)]'>
        <Sidebar />
        <ResizablePanelGroup autoSaveId='ca-workspace-layout' direction='horizontal'>
          <ResizablePanel defaultSize={20} minSize={11} className='bg-[#5E2C5F]'>
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20} minSize={20}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={29} minSize={20}>
                {parentMessageId ? (
                  <div className='flex flex-col h-full'>
                    <Thread messageId={parentMessageId as Id<'messages'>} onClose={closeParentMessage} />
                  </div>
                ) : profileMemberId ? (
                  <Profile memberId={profileMemberId as Id<'members'>} onClose={closeParentMessage} />
                ) : (
                  <div className='flex justify-center items-center h-full'>
                    <Loader2 className='animate-spin text-muted-foreground size-5' />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Layout;
