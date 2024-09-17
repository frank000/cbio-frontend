import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';
import { User } from '../shared/models/user.interface';
import { CrudAbstractService } from './crud.service';

 

@Injectable({providedIn:'root'})
export class DiologService extends CrudAbstractService{
    override getControllerName(): string {
        return "dialog"
    }
   
    constructor( ) { 
        super()
    }
    

    getAllBySender(identificadorRemetente:string):Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/sender/${identificadorRemetente}`);
    }
 

 
}