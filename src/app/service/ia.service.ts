import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable, Subject } from 'rxjs';
 

@Injectable({providedIn:'root'})
export class IaService {

    public readonly _http = inject(HttpClient);
    url:string = environment.urlBackend;
    public iaTipSubscription = new Subject<string>();
 

    getControllerName(): string {
        return "ia"
    }
   
    constructor( ) { 
  
    }
    
    obtem(chat:string):Observable<any>{
        return this._http.post(`${this.url}/v1/${this.getControllerName()}/query`, chat);
    }    
    

 
}
