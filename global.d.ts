interface Window {
  electronAPI: {
    saveAPIKey: (key: string) => Promise<boolean>;
    hasAPIKey: () => Promise<boolean>;
  },
  chat: {
    getChats: () => Chat[];          // คืน array ของ Chat
    getChat: (_id: string) => Chat;
    addChat: (chat: Chat) => Chat;   // คืน Chat ที่เพิ่มแล้ว
    updateChat: (_id: string, chatLogs: ChatLog[]) => void;
    updateChatNotSave: (chat: Chat) =>  | null; 
    deleteChat: (_id: string) => boolean; // คืน true/false
    updateChatZoomScale: (_id: string, zoomScale: number) => void;
    updateChatLogPos: (_id: string, chatLog: ChatLog) => void;
    updateChatOffset: (_id: string, offset: { x: number, y: number }) => void;
  }
}

// addChat ไม่จำเป็นต้องใส่ id เพราะ LokiJs สร้างให้