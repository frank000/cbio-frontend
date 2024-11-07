import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.interface';
import { CrudAbstractService } from './crud.service';

 

@Injectable({providedIn:'root'})
export class SummaryService extends CrudAbstractService{
    override getControllerName(): string {
        return "summary";
    }
    
 

    constructor( ) { 
        super();
    }

    getAttendanceByAttendantsPerPeriod(initDate:string, endDate:string):Observable<any>{
        let params:HttpParams = new HttpParams();
        params = params.set("initDate", initDate);
        params = params.set("endDate", endDate);
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/per-period`, {params});
    }


    getAttendanceByAttendantsPerMonthAndYear():Observable<any>{
       
        return this._http.get(`${this.url}/v1/${this.getControllerName()}/per-month`, {});
    }

 
}
