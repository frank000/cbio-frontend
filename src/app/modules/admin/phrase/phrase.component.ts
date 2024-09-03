import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { colDef } from '@bhplugin/ng-datatable';
import { PhraseService } from 'src/app/service/phrase.service';
import { GridAbstract } from '../../base/grid-controller/grid-abstract.controller';
import { CrudAbstractService } from 'src/app/service/crud.service';
import { CrudInterface } from 'src/app/shared/models/crud.interface';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared.module';
import { showMessage } from '../../base/showMessage';

@Component({
  selector: 'app-phrase',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './phrase.component.html',
  styleUrl: './phrase.component.css'
})
export class PhraseComponent extends GridAbstract{

  override getService(): CrudAbstractService {
   return this._phraseService;
  }

  override setGridRows(rows: CrudInterface[]): void {
    this.gridRowsUser = rows;
  }

  override setTotalGrid(total: number): void {
    this.totalRowsUser = total;
  }

  override getParamsPage() {
    return  {
        current_page: 0,
        pagesize: 10,
          // sort_column: 'id',
          // sort_direction: 'asc',
          // search: '',
          // column_filters: [],
      };
  }
  gridRowsUser: CrudInterface[] = []
  totalRowsUser!:number;
  
  override getParamsFiltro(): FormGroup {
    return this.paramsFiltro;
  }

  cols: Array<colDef> = [];
  rows: Array<any> = [];
  gridCompany: Array<any> = []


  _phraseService = inject(PhraseService);
  _route = inject(Router);
  _fb = inject(FormBuilder);
  paramsFiltro!: FormGroup;
  params:any;

  constructor() {
    super();
    this.initData(); 
    this.paramsFiltro = this._fb.group({
        filter: ['']
    });  
    this.loadGrid();      
  }
 
  initData(){
    this.cols = [
      { field: "id", title: "ID", filter: false, sort: false },
      { field: "description", title: "Descrição" },

      { field: "acoes", title: "Ações" }

    ];
  }

  loadToEdit(value:any){
    let path = "admin/phrase/form/" + value.id;
    this._route.navigate([path])
  }


  deleteRow(value:any){
    this._phraseService.delete(value.id)
    .subscribe(
      (resp:any) =>{
        showMessage("Frase deletada com sucesso")
        this.loadGrid()
      }
    )
  }

  
}
