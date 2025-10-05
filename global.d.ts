interface Window {
  electronAPI: {
    saveAPIKey: (key: string) => Promise<boolean>;
    hasAPIKey: () => Promise<boolean>;
  },
  chat: {
    getChats: () => Promise<Chat[]>;          // คืน array ของ Chat
    getChat: (_id: string) => Promise<Chat>;
    addChat: (chat: Chat) => Promise<Chat>;   // คืน Chat ที่เพิ่มแล้ว
    updateChat: (chat: Chat) => Promise<Chat | null>; // คืน Chat ที่ update หรือ null ถ้าไม่เจอ
    updateChatXY: (chat: Chat) => Promise<Chat | null>; 
    deleteChat: (_id: string) => Promise<boolean>; // คืน true/false
  }
}

// addChat ไม่จำเป็นต้องใส่ id เพราะ LokiJs สร้างให้