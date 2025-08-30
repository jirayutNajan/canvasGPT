import { create } from "zustand";

export interface SideBarStore {
  isOpen: boolean;
  toggle: () => void;
}

export const useSideBarstore = create<SideBarStore>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen }))
}))