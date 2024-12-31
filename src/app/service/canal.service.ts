import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';
import { CrudAbstractService } from './crud.service';

 

@Injectable({providedIn:'root'})
export class CanalService extends CrudAbstractService{
    override getControllerName(): string {
        return "canal";
    }
    
 

    constructor( ) { 
        super();
    }

  
    conect(canalId:any):Observable<any>{
        let query = new HttpParams();
 
        query = query.append('canalId', canalId);
        return this._http.get(`${this.url}/v1/bot/connect-bot`, {params:query});
    }
 

 
}
