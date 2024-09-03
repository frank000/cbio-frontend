import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';
import { User } from '../shared/models/user.interface';
import { CrudAbstractService } from './crud.service';
import { LoginService } from './login.service';

 

@Injectable({providedIn:'root'})
export class ChatSessionService extends CrudAbstractService{
    override getControllerName(): string {
        return "chat-session"
    }
   
    constructor( ) { 
        super()
       
    }
 

 

 
}
