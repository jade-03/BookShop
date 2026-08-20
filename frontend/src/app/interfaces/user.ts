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
}

export interface NewUser {
 lastname: string
  firstname: string
  pseudo: string
  email: string
  password: string
}
