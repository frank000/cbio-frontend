import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { colDef } from '@bhplugin/ng-datatable';
import { AttendantService } from 'src/app/service/attendant.service';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/shared/models/user.interface';
import { SharedModule } from 'src/shared.module';
import { showMessage } from '../../base/showMessage';

@Component({
  selector: 'app-attendant',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterLink],
  templateUrl: './attendant.component.html'
})
export class AttendantComponent {
  _AttendantService = inject(AttendantService);
  _route = inject(Router);
  _fb = inject(FormBuilder);
  paramsFiltro!: FormGroup;
  params = {
    current_page: 0,
    pagesize: 10,
      // sort_column: 'id',
      // sort_direction: 'asc',
      // search: '',
      // column_filters: [],
  };

  cols: Array<colDef> = [];
  gridRowsUser: User[] = []
  totalRowsUser!:number;
  constructor(){
    this.initForm();
    this.initData();
    this.carregaGridAttedant();
  }




  initData(){ 

    this.cols = [
      { field: "id", title: "ID", filter: false, sort: false },
      { field: "name", title: "Nome" },
      { field: "perfil", title: "Perfil" },
      { field: "acoes", title: "Ações" }

    ];
  }
  initForm(){
    this.paramsFiltro = this._fb.group({
      name: ['']
  });    
  }

  loadToEdit(value:any){
    let path = "admin/attendant/form/" + value.id;
    this._route.navigate([path])
  }

  deleteRow(value:any){
    this._AttendantService.delete(value.id)
    .subscribe(
      (resp:any) =>{
        showMessage("Atendente deletado com sucesso")
        this.carregaGridAttedant()
      }
    )
  }

  carregaGridAttedant() {
    let query = new HttpParams();
    if( this.paramsFiltro.controls["name"].value != null && this.paramsFiltro.controls["name"].value != ""){
      query = query.append('filter', this.paramsFiltro.controls["name"].value );

    }
    query = query.append('pageIndex', this.params.current_page);    
    query = query.append('perfil', "ATTENDANT");
    query = query.append('pageSize', this.params.pagesize );
    this._AttendantService.obtemGrid(query)
      .subscribe(
        (resp: any) => {
          this.gridRowsUser = resp.items;
          this.totalRowsUser = resp.total
        }
      );
  }

  cleanForm(){
    this.paramsFiltro.reset();
    this.carregaGridAttedant();
  }
  changeServer(data: any) {
    this.params.current_page = data.current_page-1;
    this.params.pagesize = data.pagesize;
    // this.params.sort_column = data.sort_column;
    // this.params.sort_direction = data.sort_direction;
    // this.params.search = data.search;
    // this.params.column_filters = data.column_filters;

    this.carregaGridAttedant()
  }

  search(){
    this.carregaGridAttedant();
  }
}
