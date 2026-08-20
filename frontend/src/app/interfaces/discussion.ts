import { Message } from "./message";
import { User } from "./user";

export interface Discussion {
  user: User;
  lastMessage: string;
  date: string;
}