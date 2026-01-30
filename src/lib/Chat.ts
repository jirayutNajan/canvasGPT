import type { Chat, ChatLog } from "../interface/ChatInterface";

// TODO: เรียก api ตรงนี้เลย
export const addChatlog = 
  async (input: string, chatlogLength: number, chatId?: number, viewPort?: { x: number, y: number, zoom: number } ) 
  : Promise<string> => {

  if(!chatId) {
    let newChat: Chat;

    newChat = {
      name: input.slice(0, 20),
      chat_logs: [
        {
          _id: 0,
          input: input,
          position: { x: 0, y: 0 },
          parent: [],
          child: [],
        }
      ],
      offset: { x: viewPort?.x || 0, y: viewPort?.y || 0 },
      zoomScale: viewPort?.zoom || 1,
    }
    const newChatId = (await window.chat.addChat(newChat)).$loki

    return newChatId;
  }
  else {
    const newChatlog: ChatLog = {
      _id: chatlogLength,
      input: input,
      position: { x: 0, y: 0},
      parent: [],
      child: [],
    }

    window.chat.addChatLog(chatId.toString(), newChatlog);

    return chatId.toString();
  }
}
