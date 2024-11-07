import { Injectable } from '@angular/core';
import { CrudAbstractService } from './crud.service';
import { Observable } from 'rxjs';

 

@Injectable({providedIn:'root'})
export class ResourceService extends CrudAbstractService{
    override getControllerName(): string {
        return "resource";
    }
    
 

    constructor( ) { 
        super();
    }
    

    getResourceListFilter():Observable<any>{
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/list-resource-filter`);
    }

}
