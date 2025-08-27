interface ChatLog {
  _id?: string;
  input: string;
  response?: string;
  createdAt?: string;
  position: {x: number, y: number};
  refers?: {_id: string}[]; // array or string or Array<{id: string}>
}

interface Chat {
  _id?: string;
  name: string;
  chat_logs?: ChatLog[]
}

interface Window {
  electronAPI: {
    saveAPIKey: (key: string) => Promise<boolean>;
    hasAPIKey: () => Promise<boolean>;
  },
  chatsDB: {
    insert: (doc: Chat) => Promise<Chat>;
    find: (query?: Partial<Chat>, projection?: Partial<Record<keyof Chat, 1>>) => Promise<Chat[]>;
  }
}
