import { CrudInterface } from "./crud.interface"

export interface Company extends CrudInterface{
    id:string
    email:string
    nome: string 
    telefone:string
    endereco:string
    estado: string 
    cidade:string 
    cep:string
}