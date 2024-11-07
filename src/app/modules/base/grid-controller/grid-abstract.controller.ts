import { HttpParams } from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import { CrudAbstractService } from "src/app/service/crud.service";
import { CrudInterface } from "src/app/shared/models/crud.interface";

export abstract class GridAbstract {

    abstract getParamsFiltro(): FormGroup;
    abstract getParamsPage(): any;   
    abstract getService(): CrudAbstractService;
    abstract setGridRows(rows:CrudInterface[]):void;
    abstract setTotalGrid(total:number): void;

    search() {
        this.loadGrid();
    }

    loadGrid() {
        let query = new HttpParams();
        if (this.getParamsFiltro().controls["filter"].value != null && this.getParamsFiltro().controls["filter"].value != "") {
            query = query.append('filter', this.getParamsFiltro().controls["filter"].value);

        }
        if( this.getParamsFiltro().controls["company"].value != null && this.getParamsFiltro().controls["company"].value != ""){
            query = query.append('companyId', this.getParamsFiltro().controls["company"].value );
          }
        query = query.append('pageIndex', this.getParamsPage().current_page);

        query = query.append('pageSize', this.getParamsPage().pagesize);
        this
            .getService()
            .obtemGrid(query)
            .subscribe((resp : any) => {
                this.setGridRows(resp.items);
                this.setTotalGrid(resp.total); 
            });
    }

    cleanForm(){
        this.getParamsFiltro().reset();
        this.loadGrid();
      }

      changeServer(data: any) {
        this.getParamsPage().current_page = data.current_page-1;
        this.getParamsPage().pagesize = data.pagesize;
        // this.params.sort_column = data.sort_column;
        // this.params.sort_direction = data.sort_direction;
        // this.params.search = data.search;
        // this.params.column_filters = data.column_filters;
    
        this.loadGrid()
      }
}