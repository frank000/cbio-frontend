import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';

 

@Injectable({providedIn:'root'})
export class AuthService {
 

    constructor( ) { 
    }

    getAccessToken():string | null{
        if(localStorage.getItem("access_token") != undefined){
            return localStorage.getItem("access_token") ;
        }else{
            return null;
        }
    }

    getRefreshToken():string | null{
        if(localStorage.getItem("refresh_token") != undefined){
            return localStorage.getItem("refresh_token") ;
        }else{
            return null;
        }
    }

    isLogged():boolean{
        return localStorage.getItem("access_token") != null 
                && localStorage.getItem("access_token") != "" ? true : false ;
    }


    setAccessToken(token : string):void{
        localStorage.setItem("access_token", token);
    }



    setRefreshToken(token : string):void{
        localStorage.setItem("refresh_token", token);
    }

    flush(){
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }

    getObjectUserLogged(){
        const newLocal = this.getAccessToken();
        if(newLocal != null){
 
            let jwtData = newLocal.split('.')[1]
            let decodedJwtJsonData = window.atob(jwtData) 
            return JSON.parse(decodedJwtJsonData)
        }else{
            return null;
        }
    }
}
