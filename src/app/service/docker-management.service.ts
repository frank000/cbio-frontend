import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs'; 

 

@Injectable({providedIn:'root'})
export class DockerManagementService {
    storeData: any;
    url:string = environment.urlBackend;

    private readonly _http = inject(HttpClient);

    constructor( ) { 
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
    downloadContainerLogs(containerId: string): Observable<string> {
        return this._http.get(`${this.url}/v1/app-manager/${containerId}/logs/full`, {
          responseType: 'text'
        });
      }
}
