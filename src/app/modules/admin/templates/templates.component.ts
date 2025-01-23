import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { colDef } from '@bhplugin/ng-datatable';
import { AuthService } from 'src/app/service/auth.service'; 
import { SharedModule } from 'src/shared.module';
import { GridAbstract } from '../../base/grid-controller/grid-abstract.controller';
import { CrudAbstractService } from 'src/app/service/crud.service';
import { CrudInterface } from 'src/app/shared/models/crud.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TemplateService } from 'src/app/service/template.service';
import { showMessage } from '../../base/showMessage';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-templates',
    imports: [CommonModule, SharedModule, RouterLink],
    templateUrl: './templates.component.html',
    styleUrl: './templates.component.css'
})
export class TemplatesComponent extends GridAbstract implements OnInit {

  constructor(){
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
    this.search();
    this.initData();
  }
  initData(){

    this.cols = [
      { field: "id", title: "ID", filter: false, sort: false },
      { field: "name", title: "Nome" }, 
      { field: "acoes", title: "Ações" }

    ];
  }
  override getParamsFiltro(): FormGroup {
    return this.paramsFiltro;
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

  _authService:AuthService = inject(AuthService);

  options:any[] = [];
  cols: Array<colDef> = [];
  gridRows: any[] = []
  totalRowsUser!:number;
  paramsFiltro!:FormGroup;
  _fb = inject(FormBuilder);
  templateService:TemplateService = inject(TemplateService);
  router = inject(Router);
  _phraseService:TemplateService = inject(TemplateService);
  // cleanForm(){

  // }
  override getService(): CrudAbstractService {
    return this._phraseService;
   }
 
   override setGridRows(rows: CrudInterface[]): void {
     this.gridRows = rows;
   }
 
   override setTotalGrid(total: number): void {
     this.totalRowsUser = total;
   }
   
   loadToEdit(value:any){
    this.router.navigate(['/admin/template/form', value.id])
   }


   swalWithBootstrapButtons:any;
   deleteRow(value:any){
    this.swalWithBootstrapButtons
    .fire({
        title: 'Tem certeza que deseja deletar o modelo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true,
        padding: '2em',
    })
    .then((result:any) => {
        if (result.value) {
          this.templateService.delete(value.id)
          .subscribe((resp:any)=>{
            showMessage("Recruso deletado com sucesso.");
            this.search();
          });
        }  
    });




   }


 
}
