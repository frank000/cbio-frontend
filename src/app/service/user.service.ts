import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';
import { User } from '../shared/models/user.interface';

 

@Injectable({providedIn:'root'})
export class UserService {
    storeData: any;
    url:string = environment.urlBackend;

    private readonly _http = inject(HttpClient);

    constructor( ) { 
    }


    save(user:User):Observable<any>{
 
        return this._http.post(`${this.url}/v1/user`, user);
    }

 
}
