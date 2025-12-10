import { create } from "zustand";
import type { Chat, ChatLog } from "../interface/ChatInterface";


export interface ChatStore {
  chat: Chat;
  input: string;
  isLoading: boolean;
  setLoadingInput: (input: string) => void;
  setChat: (chat: Chat ) => void;
  addChatLog: (chatLog: ChatLog) => void;
}

export const useChatCanvas = create<ChatStore>((set) => ({
  chat: { name: "", chat_logs: [], newChatBoxPosition: { x: 0, y: 0 } },
  input: "",
  isLoading: false,
  setLoadingInput: (input: string) => {
    if(input) {
      return set({ isLoading: true, input })
    }
    else {
      set({ isLoading: false, input: "" })
    }
  },
  setChat: (chat) => set({ chat }), // set chat ตามที่ต้องการ id, name, chat_logs
  addChatLog: (chatLog: ChatLog) => // การเพิ่ม chat_logs
    set((state) => ({
      chat: {
        ...state.chat,
        chat_logs: [...(state.chat.chat_logs || []), chatLog]
      }
    }
  ))
}))