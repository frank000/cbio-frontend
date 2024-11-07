
import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudAbstractService } from './crud.service';

 

@Injectable({providedIn:'root'})
export class DiologService extends CrudAbstractService{
    override getControllerName(): string {
        return "dialog"
    }
   
    constructor( ) { 
        super()
    }
    

    getAllBySender(sessionId:string, channelId:string):Observable<any>{

        
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/sender/session/${sessionId}/channel/${channelId}`);
    }
 

 
}
