import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { CrudAbstractService } from './crud.service';

 

@Injectable({providedIn:'root'})
export class MediaService extends CrudAbstractService{
    override getControllerName(): string {
        return "media"
    }
   
    constructor( ) { 
        super()
    }
    
 
    getMedia(dialogId:string):Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/media-by-dialog/${dialogId}`, { responseType: 'blob' }).pipe(
            map((blob: Blob) => {
                if(blob.size != 0){
                    // Criar um URL para o blob
                    return URL.createObjectURL(blob);
                }else{
                    return null;
                }
      
            }),
            catchError((error: any) => {
                console.error('Erro ao buscar a mídia:', error);
                return of(null); // Retornar valor padrão ou mensagem de erro
            })
        ); 
    }

    getMediTicket(name:string):Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/images/ticket/${name}`, { responseType: 'blob' }).pipe(
            map((blob: Blob) => {
                if(blob.size != 0){
                    // Criar um URL para o blob
                    return URL.createObjectURL(blob);
                }else{
                    return null;
                }
      
            }),
            catchError((error: any) => {
                console.error('Erro ao buscar a mídia:', error);
                return of(null); // Retornar valor padrão ou mensagem de erro
            })
        ); 
    }

    download(dialogId:string):Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/download-media-by-dialog/${dialogId}`, 
        { responseType: 'blob', observe: 'response' }).pipe(
            map((response: any) => {
         
                const contentDisposition = response.headers.get('Content-Disposition');
 
                let fileName = 'downloaded-file';
                if (contentDisposition) {
                    const matches = /filename="([^"]*)"/.exec(contentDisposition);
                    if (matches != null && matches[1]) { 
                        fileName = matches[1];
                    }
                }
      
                
                const downloadURL = window.URL.createObjectURL(response.body);

                // Cria um elemento <a> temporário para acionar o download
                const link = document.createElement('a');
                link.href = downloadURL;

                // Define o nome do arquivo que será baixado
                link.download = fileName; // Você pode personalizar o nome e extensão aqui

                // Adiciona o link ao DOM e aciona o clique
                link.click();

                // Remove o link do DOM após o download
                window.URL.revokeObjectURL(downloadURL);
            }),
            catchError((error: any) => {
                console.error('Erro ao buscar a mídia:', error);
                return of(null); // Retornar valor padrão ou mensagem de erro
            })
        ); 
    }

 
}
