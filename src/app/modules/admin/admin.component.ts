import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { colDef } from '@bhplugin/ng-datatable';
import { CompanyService } from 'src/app/service/company.service';
import { Company } from 'src/app/shared/models/company.interface';

// shared module
import { SharedModule } from 'src/shared.module';
import { showMessage } from '../base/showMessage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
    cols: Array<colDef> = [];
    rows: Array<any> = [];
    gridCompany: Array<Company> = []

    _companyService = inject(CompanyService);
    swalWithBootstrapButtons:any;
    constructor() {
        this.initData();
        this.swalWithBootstrapButtons = Swal.mixin({
            buttonsStyling: false,
            customClass: {
                popup: 'sweet-alerts',
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
            },
          });
      
          
    }

    initData(){
        this.loadGrid();

        this.cols = [
            { field: "id", title: "ID", filter: false, sort: false },
            { field: "nome", title: "Nome" },
            { field: "cidade", title: "Cidade" },
            { field: "acoes", title: "Ações" }

        ];

     
    }

    private loadGrid() {
        this._companyService.obtemGrid()
            .subscribe(
                (resp: any) => {
                    console.log(resp);

                    this.gridCompany = resp.items;
                }
            );
    }

    deleteRow(value:any){
        this.swalWithBootstrapButtons
        .fire({
            title: 'Tem certeza que deseja excluir?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            reverseButtons: true,
            padding: '2em',
        })
        .then((result:any) => {
            if (result.value) {
                this._companyService.delete(value.id)
                .subscribe(
                    (resp:any)=>{
                        showMessage('Companhia deletada com sucesso');
                        this.loadGrid();
                    }
                )
            }  
        });

       
    }
}
