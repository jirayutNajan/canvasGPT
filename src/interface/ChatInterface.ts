export interface ChatLog {
  _id: number;
  input: string;
  response?: string;
  createdAt?: string;
  position: {x: number, y: number};
  refers?: number; // array or string or Array<{id: string}>
  parent?: number[];
  child?: number[];
}

//todo ทำ width height ของ chatlog

export interface Chat {
  $loki?: string;
  name: string;
  chat_logs: ChatLog[];
  offset?: { x: number, y: number };
  zoomScale?: number;
}