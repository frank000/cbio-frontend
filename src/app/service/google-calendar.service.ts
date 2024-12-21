import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { CrudAbstractService } from './crud.service';
import { HttpParams } from '@angular/common/http';

 

@Injectable({providedIn:'root'})
export class GoogleCalendarService extends CrudAbstractService{
    override getControllerName(): string {
        return "google-calendar"
    }
   
    constructor( ) { 
        super()
    }
    
 
    getAuthorize(emailCalendar:string):Observable<any>{
        let query: HttpParams = new HttpParams()
        query = query.append('companyMail', emailCalendar) 
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/authorize`, {params:query}); 
    }

    getEventsByResourceId(rangeDateViewCalendar : any):Observable<any>{
        return this._http.post(`${this.url}/v1/${this.getControllerName()}/events-by-resource`, rangeDateViewCalendar);
    }
    
    

    getScheduleByResourceId(rangeDateViewCalendar : any):Observable<any>{
        return this._http.post(`${this.url}/v1/${this.getControllerName()}/schedule-by-resource`, rangeDateViewCalendar);
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

  
    insert(event : any):Observable<any>{
        return this._http.post(`${this.url}/v1/${this.getControllerName()}/event`, event); 
    }
  
    notify(event : any):Observable<any>{
        return this._http.post(`${this.url}/v1/${this.getControllerName()}/event/notify`, event); 
    }
  
    updateEvent(eventId:string, event : any):Observable<any>{
        return this._http.put(`${this.url}/v1/${this.getControllerName()}/event/${eventId}`, event); 
    }

    deleteEvent(eventId:string, event : any):Observable<any>{
        return this._http.post(`${this.url}/v1/${this.getControllerName()}/delete-event/${eventId}`, event); 

    }
}
