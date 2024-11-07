import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';
import { CrudAbstractService } from './crud.service';

 

@Injectable({providedIn:'root'})
export class TemplateService extends CrudAbstractService{
    override getControllerName(): string {
        return "template";
    }
    
 

    constructor( ) { 
        super();
    }

    getAllSelection( ):Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/selection`);
    }


    
  
 
}
