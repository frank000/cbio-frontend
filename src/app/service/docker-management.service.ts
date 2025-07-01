import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';

 

@Injectable({providedIn:'root'})
export class DockerManagementService {
    storeData: any;
    url:string = environment.urlBackend;

    private readonly _http = inject(HttpClient);

    constructor( ) { 
    }

    update(company:Company):Observable<any>{
 
        return this._http.put(`${this.url}/v1/company`, company);
    }


    restartContainer(containerId:string):Observable<any>{
 
        return this._http.post(`${this.url}/v1/app-manager/${containerId}/restart`, {});
    }

    listAllContainers():Observable<any>{
        return this._http.get(`${this.url}/v1/app-manager`);
    }

    rebuildAndRestartContainer(name:string, imageName:string , port:string):Observable<any>{
 
        const params = new HttpParams()
        .set('imageName', imageName)
        .set('externalPort', port);
    
    return this._http.post(
        `${this.url}/v1/app-manager/${name}/rebuild`, 
        null, // Corpo vío
        { params } // Parâmetros como query string
    );
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
