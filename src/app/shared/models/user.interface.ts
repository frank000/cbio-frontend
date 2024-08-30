import { Company } from "./company.interface"

export interface User{
    id:number
    email:string
    password:string
    company:Company
}