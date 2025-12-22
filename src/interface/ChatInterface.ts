export interface ChatLog {
  _id: number;
  input: string;
  response?: string;
  createdAt?: string;
  position: {x: number, y: number};
  parent: number[];
  child: number[];
  size?: { width: number, height: number };
}

export interface Chat {
  $loki?: string;
  name: string;
  chat_logs: ChatLog[];
  offset: { x: number, y: number };
  zoomScale?: number;
  newChatBoxPosition: { x: number, y: number }, // remove later
}