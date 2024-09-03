import { Company } from "./company.interface"
import { CrudInterface } from "./crud.interface"

export interface Canal  {
    id:string 
    nome: string 
    token:string
    idCanal:string
    primeiroNome: string 
    userName:string 
    apiKey:string
    cliente:string
    ativo:boolean
    company:Company
}