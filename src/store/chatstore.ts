import { create } from "zustand"

interface ChatStore {
  input: string;
  replyChatId: number | null;
  replyChatText: string;
  setInput: (input: string) => void;
  setReplyChatId: (id: number | null) => void;
  setReplyChatText: (text: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  input: "",
  replyChatId: null,
  replyChatText: "",
  setInput: (input: string) => set({ input }),
  setReplyChatId: (id: number | null) => set({ replyChatId: id }),
  setReplyChatText: ( text: string ) => set({ replyChatText: text })
}))