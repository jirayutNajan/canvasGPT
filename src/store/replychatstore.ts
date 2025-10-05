import { create } from "zustand";

interface ReplyChatStore {
  replyChatId: number | null;
  replyChatText: string;
  setReplyChatId: (id: number | null) => void;
  setReplyChatText: (text: string) => void;
}

export const useReplyChatStore = create<ReplyChatStore>((set) => ({
  replyChatId: null,
  replyChatText: "",
  setReplyChatId: (id) => set({ replyChatId: id }),
  setReplyChatText: (text) => set({ replyChatText: text }),
}));
