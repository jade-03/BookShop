import { Listing } from "./listing";
import { Message } from "./message";
import { User } from "./user";

export interface Discussion {
  id: number
  lastMessage: string;
  date: string;
  user: User;
  listing: Listing
}