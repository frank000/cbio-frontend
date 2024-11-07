import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { colDef } from '@bhplugin/ng-datatable';
import { CrudInterface } from 'src/app/shared/models/crud.interface';
import { SharedModule } from 'src/shared.module';
import { GridAbstract } from '../../base/grid-controller/grid-abstract.controller';
import { CrudAbstractService } from 'src/app/service/crud.service';
import { ResourceService } from 'src/app/service/resource.service';
import { Router, RouterModule } from '@angular/router';
import { showMessage } from '../../base/showMessage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recurso',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './recurso.component.html',
  styleUrl: './recurso.component.css'
})
export class RecursoComponent extends GridAbstract implements OnInit{
 

  _resourceService = inject(ResourceService);
  router = inject(Router);
  params!: FormGroup;
  minStartDate: any = '';
  minEndDate: any = '';
  gridRowsUser: CrudInterface[] = [];
  totalRowsUser!:number;
  cols: Array<colDef> = [];
  rows: Array<any> = [];
  paramsFiltro!: FormGroup;
  _fb = inject(FormBuilder);

  constructor() {
    super();
    this.paramsFiltro = this._fb.group({
      filter: [''],
      company:['']
  });
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
    this.initData()
    this.search();
  }
  initData(){
    this.cols = [
      { field: "id", title: "ID", filter: false, sort: false },
      { field: "dairyName", title: "Nome da agenda" },
      { field: "email", title: "Email" },
      { field: "status", title: "Status" },
      { field: "acoes", title: "Ações" }

    ];
  }
  saveResource(){
        
  }

  override getService(): CrudAbstractService {
    return this._resourceService;
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
 
   override getParamsFiltro(): FormGroup {
     return this.paramsFiltro;
   }
   loadToEdit(value:any){
    let path = "apps/agendai/recurso/form/" + value.id;
    this.router.navigate([path])
  }

  swalWithBootstrapButtons:any;
  deleteRow(value:any){
    this.swalWithBootstrapButtons
    .fire({
        title: 'Tem certeza que deseja deletar o recurso?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true,
        padding: '2em',
    })
    .then((result:any) => {
        if (result.value) {
            this._resourceService.delete(value.id)
            .subscribe((resp:any)=>{
                showMessage("Recruso deletado com sucesso.");
                this.search();
            })
        }  
    });
  }

   
}
