import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';
import { User } from '../shared/models/user.interface';
import { CrudAbstractService } from './crud.service';

 

@Injectable({providedIn:'root'})
export class WhatsappService extends CrudAbstractService{
    override getControllerName(): string {
        return "whatsapp"
    }
   
    constructor( ) { 
        super()
    }
    
 
    getMedia(dialogId:string):Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/media-by-dialog/${dialogId}`, { responseType: 'blob' }).pipe(
            map((blob: Blob) => {
                // Criar um URL para o blob
                return URL.createObjectURL(blob);
            }),
            catchError((error: any) => {
                console.error('Erro ao buscar a mídia:', error);
                return of(null); // Retornar valor padrão ou mensagem de erro
            })
        ); 
    }

 
}
