import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

 

@Injectable({providedIn:'root'})
export class LoginService {
    storeData: any;
    url:string = environment.urlBackend;

    onLogging: Subject<boolean> = new Subject();

    private readonly _http = inject(HttpClient);

    constructor( ) { 
    }


    login(email: any, password:any):Observable<any>{
 
        return this._http.post(`${this.url}/v1/login`, {email, password});
    }

    logout(refreshToken:string):Observable<any>{ 
        return this._http.post(`${this.url}/v1/login/logout`, {refreshToken});
    }
}
