import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { CrudInterface } from '../shared/models/crud.interface';

 

@Injectable({providedIn:'root'})
export abstract class CrudAbstractService {
    storeData: any;
    url:string = environment.urlBackend;

    public readonly _http = inject(HttpClient);

    abstract getControllerName():string;

    constructor( ) { 
    }

    update(company:CrudInterface):Observable<any>{
 
        return this._http.put(`${this.url}/v1/${this.getControllerName()}`, company);
    }


    save(company:CrudInterface):Observable<any>{
 
        return this._http.post(`${this.url}/v1/${this.getControllerName()}`, company);
    }


    delete(id: string):Observable<any>{

        return this._http.delete(`${this.url}/v1/${this.getControllerName()}/${id}`);
    }

    obtemGrid(query:HttpParams):Observable<any>{
      
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/grid`,{params:query});
    }

    obtem(id:string):Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/${id}`);
    }    
    
    getAll( ):Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}`);
    }

 
}
