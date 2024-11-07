import { Injectable } from '@angular/core';
import { CrudAbstractService } from './crud.service';

 

@Injectable({providedIn:'root'})
export class ContactService extends CrudAbstractService{
    override getControllerName(): string {
        return "contact";
    }
    

    constructor( ) { 
        super();
    }

}
