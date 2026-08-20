import { User } from "./user"

export interface Message {
    id:number
    content:string
    send_at: Date
    sender:User
    receiver:User
}
