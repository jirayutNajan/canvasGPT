import { create } from "zustand";

export interface ApiStore {
  hasApi: boolean;
  setHasApi: (b: boolean) => void;
}

export const useApiStore = create<ApiStore>((set) => ({
  hasApi: true,
  setHasApi: (b: boolean) => set({ hasApi: b })
}))