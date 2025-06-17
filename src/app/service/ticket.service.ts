import {  Injectable } from '@angular/core';
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

    
    updateFile(ticket:FormData):Observable<any>{
 
        return this._http.put(`${this.url}/v1/${this.getControllerName()}`, ticket);
    }


    saveFile(ticket:FormData):Observable<any>{
 
        return this._http.post(`${this.url}/v1/${this.getControllerName()}`, ticket);
    }

 

    obtemTiposTicket():Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/tipos`);
    }  

    obtemTiposStatus():Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/status`);
    }  
}
