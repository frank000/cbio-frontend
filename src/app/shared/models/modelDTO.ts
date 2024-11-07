import { BodyDTO } from "./bodyDTO";
import { CrudInterface } from "./crud.interface";

export interface ModelDTO extends CrudInterface{

    name:string|null;
    body:BodyDTO|null;


}