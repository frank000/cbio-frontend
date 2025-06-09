import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';
import { User } from '../shared/models/user.interface';
import { CrudAbstractService } from './crud.service';
import { CrudInterface } from '../shared/models/crud.interface';
import { profile } from 'console';

 

@Injectable({providedIn:'root'})
export class UserService extends CrudAbstractService{
    override getControllerName(): string {
        return "user"
    }
   
    constructor( ) { 
        super()
    }
    
    override save(company: CrudInterface): Observable<any> {
        return this._http.post(`${this.url}/v1/${this.getControllerName()}/profile`, company);
    }

    updatePassword(user:any):Observable<any>{
        return this._http.put(`${this.url}/v1/${this.getControllerName()}/password`, user);
    }

 
    updateSession(idSession:string ,user:any):Observable<any>{
 
        return this._http.put(`${this.url}/v1/${this.getControllerName()}/session/${idSession}`, user);
    }
    
 
    bindContact(idSession:string, contact:any):Observable<any>{
 
        return this._http.put(`${this.url}/v1/${this.getControllerName()}/session/${idSession}/bind`, contact);
    }

    obtemAdminUserByCompany(id:string):Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/admin-by-company/${id}`);
    }    
 
}
