import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';

 

@Injectable({providedIn:'root'})
export class CompanyService {
    storeData: any;
    url:string = environment.urlBackend;

    private readonly _http = inject(HttpClient);

    constructor( ) { 
    }

    update(company:Company):Observable<any>{
 
        return this._http.put(`${this.url}/v1/company`, company);
    }


    save(company:Company):Observable<any>{
 
        return this._http.post(`${this.url}/v1/company`, company);
    }

    obtemGrid():Observable<any>{
        return this._http.get(`${this.url}/v1/company/grid`);
    }

    statusPayment():Observable<any>{
        return this._http.get(`${this.url}/v1/company/status-payment`);
    }

    statusPaymentList():Observable<any>{
        return this._http.get(`${this.url}/v1/company/status-payment/list`);
    }

    obtemCompany(id:string):Observable<any>{
        return this._http.get(`${this.url}/v1/company/${id}`);
    }

    getFreePort():Observable<any>{
        return this._http.get(`${this.url}/v1/company/free-port`);
    }

    getConfigByCompany():Observable<any>{
        return this._http.get(`${this.url}/v1/company/config`);
    }

    updateConfig(config:any):Observable<any>{
        return this._http.put(`${this.url}/v1/company/config`, config);
    }

    getPreferences():Observable<any>{
        return this._http.get(`${this.url}/v1/company/config-preferences`);
    }

    getStatusInstagram(id:string):Observable<any>{
        return this._http.get(`${this.url}/v1/company/credential-instagram/${id}`);
    }

    hasCredential():Observable<any>{
        return this._http.get(`${this.url}/v1/company/credential/has`);
    }


    saveConfig(config:any):Observable<any>{
 
        return this._http.post(`${this.url}/v1/company/config`, config);
    }

    delete(id:string){
        return this._http.delete(`${this.url}/v1/company/${id}`);

    }
 
 
}
