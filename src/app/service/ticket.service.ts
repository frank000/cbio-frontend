import { Injectable } from '@angular/core';
import { CrudAbstractService } from './crud.service';
import { Observable } from 'rxjs';

 

@Injectable({providedIn:'root'})
export class TicketService extends CrudAbstractService{
    override getControllerName(): string {
        return "ticket"
    }
   
    constructor( ) { 
        super()
    }


    obtemTiposTicket():Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/tipos`);
    }  
}
