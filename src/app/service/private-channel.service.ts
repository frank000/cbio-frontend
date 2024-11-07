import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';
import { User } from '../shared/models/user.interface';
import { CrudAbstractService } from './crud.service';

 

@Injectable({providedIn:'root'})
export class PrivateChannelService extends CrudAbstractService{
    override getControllerName(): string {
        return "private-channel"
    }
   
    constructor( ) { 
        super()
    }
    
 
    sendFile(file:File , jsonDto:string):Observable<any>{
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('jsonDto', jsonDto);  // Note que você envia o JSON como string
      
        return this._http.post(`${this.url}/v1/${this.getControllerName()}/send-file`, formData);
    }

 
}
