'use client';

import CreateWorkspaceModal from '~/features/workspaces/components/create-workspace-modal';
import { useMountedState } from 'react-use';

export const Modals = () => {
  const mountedState = useMountedState();

  if (!mountedState) return null;

  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};
