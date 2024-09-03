import { Company } from "./company.interface"
import { CrudInterface } from "./crud.interface"

export interface User extends CrudInterface{
    id:number
    email:string
    password:string
    name:string
    company:Company
}