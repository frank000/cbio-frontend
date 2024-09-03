import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';
import { User } from '../shared/models/user.interface';
import { CrudAbstractService } from './crud.service';

 

@Injectable({providedIn:'root'})
export class UserService extends CrudAbstractService{
    override getControllerName(): string {
        return "user"
    }
   
    constructor( ) { 
        super()
    }
    
 

 
}
