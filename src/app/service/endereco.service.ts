import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SelectionDTO } from '../shared/models/selectionDTO';

 

@Injectable({providedIn:'root'})
export class EnderecoService {
    storeData: any;
    url:string = environment.urlBackend;

    private readonly _http = inject(HttpClient);

    constructor( ) { 
    }


    getUfs():Observable<SelectionDTO[]>{
 
        return this._http.get<SelectionDTO[]>(`${this.url}/v1/endereco/ufs`,  {});
    }

    getCidades(uf:string):Observable<SelectionDTO[]>{
 
        return this._http.get<SelectionDTO[]>(`${this.url}/v1/endereco/cidades/${uf}`, {});
    }
 
}
