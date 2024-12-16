import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { colDef } from '@bhplugin/ng-datatable';
import { AttendantService } from 'src/app/service/attendant.service';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/shared/models/user.interface';
import { SharedModule } from 'src/shared.module';
import { showMessage } from '../../base/showMessage';
import { AuthService } from 'src/app/service/auth.service';
import { CompanyService } from 'src/app/service/company.service';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { MessageService } from 'src/app/service/message.service';


@Component({
  selector: 'app-attendant',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterLink],
  templateUrl: './attendant.component.html'
})
export class AttendantComponent implements OnInit{
  _AttendantService = inject(AttendantService);
  _route = inject(Router);
  _fb = inject(FormBuilder);
  _authService = inject(AuthService);
  _companyService = inject(CompanyService);
  messageService = inject(MessageService);

  swalWithBootstrapButtons:any;
  paramsFiltro!: FormGroup;
  options: Array<{ id: number, label: string }> = []; // Inicializar como array vazio
  input1!:any;
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
  store: any;
  constructor(
    public storeData: Store<any>
  ){
    this.initForm();
    this.initData();
    this.carregaGridAttedant();
    this.initStore();

    this.swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: false,
      customClass: {
          popup: 'sweet-alerts',
          confirmButton: 'btn btn-secondary',
          cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
      },
    });




  }
  ngOnInit(): void {
    this.carregaCompanias();
 
  }

  async initStore() {
    this.storeData
        .select((d) => d.index)
        .subscribe((d) => {
            this.store = d;
            console.log(this.store);
            
        });
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
      name: [''],
      company: ['']
  });
  }

  loadToEdit(value:any){
    let path = "admin/attendant/form/" + value.id;
    this._route.navigate([path])
  }

  deleteRow(value:any){
 
    this.swalWithBootstrapButtons
    .fire({
        title: 'Tem certeza que deseja excluir o atendente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true,
        padding: '2em',
    })
    .then((result:any) => {
        if (result.value) {
          this._AttendantService.delete(value.id)
            .subscribe(
              (resp:any) =>{
                showMessage("Atendente deletado com sucesso")
                this.carregaGridAttedant()
              }
            )
        }  
    }); 
  }

  carregaCompanias() {
    this._companyService.obtemGrid().subscribe(
      (resp: any) => {
  
        // Limpa o array de opções antes de preenchê-lo
        this.options = [];
  
        resp.items.forEach((item: any) => {
          this.options.push({
            id: item.id,
            label: item.nome
          });
        });
  
          },
      (error) => {
        console.error('Erro ao carregar companhias:', error);
      }
    );
  }

  carregaGridAttedant() {
    let query = new HttpParams();
    if( this.paramsFiltro.controls["name"].value != null && this.paramsFiltro.controls["name"].value != ""){
      query = query.append('filter', this.paramsFiltro.controls["name"].value );
    }
    if( this.paramsFiltro.controls["company"].value != null && this.paramsFiltro.controls["company"].value != ""){
      query = query.append('companyId', this.paramsFiltro.controls["company"].value );
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
