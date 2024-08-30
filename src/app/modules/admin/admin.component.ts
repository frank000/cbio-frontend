import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { colDef } from '@bhplugin/ng-datatable';
import { CompanyService } from 'src/app/service/company.service';
import { Company } from 'src/app/shared/models/company.interface';

// shared module
import { SharedModule } from 'src/shared.module';

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
 
    constructor() {
        this.initData();
        
      
          
    }

    initData(){
        this._companyService.obtemGrid()
        .subscribe(
            (resp:any) =>{
                console.log(resp);
                
                this.gridCompany = resp.items
            }
        )

        this.cols = [
            { field: "id", title: "ID", filter: false, sort: false },
            { field: "nome", title: "Nome" },
            { field: "cidade", title: "Cidade" },
            { field: "acoes", title: "Ações" }

        ];

        // this.rows = [
        //     {
        //     id: 1,
        //     name: "Leanne Graham",
        //     username: "Bret",
        //     email: "Sincere@april.biz",
        //     address: {
        //         street: "Kulas Light",
        //         suite: "Apt. 556",
        //         city: "Gwenborough",
        //         zipcode: "92998-3874",
        //         geo: {
        //             lat: "-37.3159",
        //             lng: "81.1496",
        //         },
        //     },
        //     phone: "1-770-736-8031 x56442",
        //     website: "hildegard.org",
        //     company: {
        //         name: "Romaguera-Crona",
        //         catchPhrase: "Multi-layered client-server neural-net",
        //         bs: "harness real-time e-markets",
        //     },
        //     date: "Tue Sep 27 2022 22:19:57",
        //     age: 10,
        //     active: true,
        //     }, 
        // ];
    }
}
