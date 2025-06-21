
import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudAbstractService } from './crud.service';
import { HttpParams } from '@angular/common/http';

 

@Injectable({providedIn:'root'})
export class DiologService extends CrudAbstractService{
    override getControllerName(): string {
        return "dialog"
    }
   
    constructor( ) { 
        super()
    }
    

    // getAllBySender(sessionId:string, channelId:string):Observable<any>{

        
    //     return this._http.get(`${this.url}/v1/${this.getControllerName()}/sender/session/${sessionId}/channel/${channelId}`);
    // }

    getAllBySender(sessionId:string, channelId: string, page: number = 1, size: number = 10): Observable<any> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/sender/session/${sessionId}/channel/${channelId}`, { params });
    }

 
}
