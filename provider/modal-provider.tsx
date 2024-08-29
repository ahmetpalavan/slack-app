'use client';

import { useMountedState } from 'react-use';
import { CreateChannelModal } from '~/features/channels/components/create-channel-modal';
import CreateWorkspaceModal from '~/features/workspaces/components/create-workspace-modal';

export const Modals = () => {
  const mountedState = useMountedState();

  if (!mountedState) return null;

  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </>
  );
};
