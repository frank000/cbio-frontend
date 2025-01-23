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
import { AuthService } from 'src/app/service/auth.service';
import { CompanyService } from 'src/app/service/company.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-phrase',
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

  options: Array<{ id: number, label: string }> = []; // Inicializar como array vazio

  _phraseService = inject(PhraseService);
  _route = inject(Router);
  _authService = inject(AuthService);
  _companyService = inject(CompanyService);
  _fb = inject(FormBuilder);
  paramsFiltro!: FormGroup;
  params:any;

  constructor() {
    super();
    this.initData(); 
    this.paramsFiltro = this._fb.group({
        filter: [''],
        company:['']
    });  
    this.loadGrid();
    this.carregaCompanias();

    this.swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: false,
      customClass: {
          popup: 'sweet-alerts',
          confirmButton: 'btn btn-secondary',
          cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
      },
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

  swalWithBootstrapButtons:any;
  deleteRow(value:any){

    this.swalWithBootstrapButtons
    .fire({
        title: 'Tem certeza que deseja excluir a frase?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true,
        padding: '2em',
    })
    .then((result:any) => {
        if (result.value) {
       
          this._phraseService.delete(value.id)
          .subscribe(
            (resp:any) =>{
              showMessage("Frase deletada com sucesso")
              this.loadGrid()
            }
          )
        }  
    });

  }

  
}
