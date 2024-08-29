import { create } from 'zustand';

interface CreateChannelModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCreateChannelModal = create<CreateChannelModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
