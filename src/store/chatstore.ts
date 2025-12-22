import { create } from 'zustand'

interface ChatStore {
  isAddInput: boolean,
  input: string,
  replayChatId?: number,
  setIsAddInput: (input: boolean) => void,
  setInput: (input: string) => void,
  setReplyChatId: (id: number) => void
}


export const useChatStore = create<ChatStore>((set) => ({
  isAddInput: false,
  input: "",
  replayChatId: undefined,
  setIsAddInput: (isAdd: boolean) => set({ isAddInput: isAdd }),
  setInput: (input: string) => set({ input }),
  setReplyChatId: (id: number) => set({ replayChatId: id })
}))