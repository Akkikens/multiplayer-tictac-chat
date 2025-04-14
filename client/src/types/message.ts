export enum MessageType {
  USER,
  STATUS,
}

export interface Message {
  type: MessageType;
  datetime: number;
  isAuthor: boolean;
  text?: string;
}
