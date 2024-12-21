import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { colDef } from '@bhplugin/ng-datatable';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/service/auth.service';
import { CompanyService } from 'src/app/service/company.service';
import { TicketService } from 'src/app/service/ticket.service';
import { SharedModule } from 'src/shared.module';
import Swal from 'sweetalert2';
import { showMessage } from '../../base/showMessage';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterLink],
  templateUrl: './ticket.component.html'
})
export class TicketComponent  implements OnInit{

  swalWithBootstrapButtons:any;
  paramsFiltro!: FormGroup;
  _fb = inject(FormBuilder);
  _authService = inject(AuthService);
  _ticketService = inject(TicketService);
  _companyService = inject(CompanyService);
  _route = inject(Router);

  params = {
    current_page: 0,
    pagesize: 10,
      // sort_column: 'id',
      // sort_direction: 'asc',
      // search: '',
      // column_filters: [],
  };
  cols: Array<colDef> = [];
  gridRowsUser: any[] = []
  totalRowsUser!:number;
  options: Array<{ id: number, label: string }> = []; // Inicializar como array vazio
 
  optionsStatus: any[] = []; // Inicializar como array vazio
  optionsType: any[] = []; // Inicializar como array vazio
  constructor(
    public storeData: Store<any>
  ){

    this._ticketService.obtemTiposStatus()
    .subscribe(
      (resp:any)=>{
        this.optionsStatus = resp;
      }
    );

    this._ticketService.obtemTiposTicket()
    .subscribe(
      (resp:any)=>{
        this.optionsType = resp;
      }
    );

    this.swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: false,
      customClass: {
          popup: 'sweet-alerts',
          confirmButton: 'btn btn-secondary',
          cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
      },
    });
  }

  getLabelStatus(id : any){
    let status:any = this.optionsStatus.filter(item => item.id == id);
 
    if(status[0] != null){
      return status[0].label;
    }else{
      return "";
    } 
  }
  
  ngOnInit(): void {
    this.initForm();
    this.carregaCompanias();
    this.initData();
    this.carregaGridTicket()
  }

  initForm(){
    this.paramsFiltro = this._fb.group({
        name: [''],
        company: [''],
        status: [null],
        type: [null],

    });
  }
  
  cleanForm(){
    this.paramsFiltro.reset();
    this.carregaGridTicket();
  }
  changeServer(data: any) {
    this.params.current_page = data.current_page-1;
    this.params.pagesize = data.pagesize;
    // this.params.sort_column = data.sort_column;
    // this.params.sort_direction = data.sort_direction;
    // this.params.search = data.search;
    // this.params.column_filters = data.column_filters;

    this.carregaGridTicket()
  }

  initData(){

    this.cols = [
      { field: "protocolNumber", title: "Protocolo", filter: false, sort: false },
      { field: "title", title: "Titulo" },
      { field: "type", title: "Tipo" },
      { field: "status", title: "Status" },
      { field: "acoes", title: "Ações" }

    ];
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
  carregaGridTicket() {
    let query = new HttpParams();
    if( this.paramsFiltro.controls["name"].value != null && this.paramsFiltro.controls["name"].value != ""){
      query = query.append('filter', this.paramsFiltro.controls["name"].value );
    }
    if( this.paramsFiltro.controls["company"].value != null && this.paramsFiltro.controls["company"].value != ""){
      query = query.append('companyId', this.paramsFiltro.controls["company"].value );
    }
    if( this.paramsFiltro.controls["status"].value != null && this.paramsFiltro.controls["status"].value != ""){
      query = query.append('status', this.paramsFiltro.controls["status"].value );
    }
    if( this.paramsFiltro.controls["type"].value != null && this.paramsFiltro.controls["type"].value != ""){
      query = query.append('type', this.paramsFiltro.controls["type"].value );
    }
    query = query.append('pageIndex', this.params.current_page); 
    query = query.append('pageSize', this.params.pagesize );
    this._ticketService.obtemGrid(query)
      .subscribe(
        (resp: any) => {
          this.gridRowsUser = resp.items;
          this.totalRowsUser = resp.total
        }
      );
  }


  loadToEdit(value:any){
    let path = "dashboard/tickets/form/" + value.id;
    this._route.navigate([path])
  }

  deleteRow(value:any){
 
    this.swalWithBootstrapButtons
    .fire({
        title: 'Tem certeza que deseja excluir o ticket?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true,
        padding: '2em',
    })
    .then((result:any) => {
        if (result.value) {
          this._ticketService.delete(value.id)
            .subscribe(
              (resp:any) =>{
                showMessage("Ticket deletado com sucesso")
                this.carregaGridTicket();
              }
            )
        }  
    }); 
  }
  search(){
    this.carregaGridTicket();
  }


}
