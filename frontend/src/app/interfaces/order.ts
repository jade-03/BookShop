import { Payement } from "../components/payement/payement"
import { Listing } from "./listing"
import { User } from "./user"

export interface Order {
    id: number
    total:number
    user: User
    listing: Listing
    payement: Payement
}
