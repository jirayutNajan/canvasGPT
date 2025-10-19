export interface ChatLog {
  _id: number;
  input: string;
  response?: string;
  createdAt?: string;
  position: {x: number, y: number};
  parent: number[];
  child: number[];
}

export interface Chat {
  $loki?: string;
  name: string;
  chat_logs: ChatLog[];
  offset?: { x: number, y: number };
  zoomScale?: number;
}