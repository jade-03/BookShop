import { Listing } from "./listing"

export interface User {
  id:number
  lastname: string
  firstname: string
  pseudo: string
  email: string
  role: string
  password: string
  picture_profil: string
  createdAt:Date
  listing: Listing
}

export interface NewUser {
 lastname: string
  firstname: string
  pseudo: string
  email: string
  password: string
}
