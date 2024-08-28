'use client';

import { useMountedState } from 'react-use';
import CreateWorkspaceModal from '~/features/workspaces/components/create-workspace-modal';

export const Modals = () => {
  const mountedState = useMountedState();

  if (!mountedState) return null;

  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};
