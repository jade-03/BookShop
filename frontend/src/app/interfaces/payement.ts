import { PayementMethod } from "../enums/payement-method"

export interface Payement {
    id:number
    payement_method: PayementMethod
    amount: number
    payement_date: Date
}
