import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { colDef } from '@bhplugin/ng-datatable';
import { log } from 'console';
import { filter, map } from 'rxjs';
import { PaymentService } from 'src/app/service/payment.service';
import { SharedModule } from 'src/shared.module';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, SharedModule,RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{

  route = inject(ActivatedRoute);
  router = inject(Router);
  companyId?: string = undefined;
  paymentService:PaymentService = inject(PaymentService);
  totalPaymentsSearched: number = 0;


  params = {
    current_page: 0,
    pagesize: 10,
      // sort_column: 'id',
      // sort_direction: 'asc',
      // search: '',
      // column_filters: [],
  };
 
  cols: Array<colDef> = [];
  gridRowsPayment: any[] = []
  totalRowsPayment!:number;


  constructor() {
  
  }
  ngOnInit(): void {
    this.getDetails();
    this.initData();
  }
  initData(){

    this.cols = [
      { field: "subscriptionId", title: "Id Inscrição", filter: false, sort: false },
      { field: "email", title: "Administrator" }, 
      { field: "status", title: "Status" }, 
      { field: "createdAt", title: "Criado em" }, 
      { field: "acoes", title: "Ações" }

    ];
  }
  getDetails(){
    this.route.paramMap.subscribe({
      next: (params) => {

        this.loadDetails(null)
      
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes:', err);
      }
    }); 
  }


  private loadDetails(companyId:string | null) {

    let query = new HttpParams();
    if(companyId != null){
      query = query.append('companyId', companyId);
    }

    this.paymentService.obtemGrid(query)
      .pipe(
        filter(data => !!data), // Verifica se os dados existem
        map((data) => {
          // Se os dados estiverem presentes, realiza o filtro
          this.totalPaymentsSearched = data.total;

          // Filtra os itens com base no nome
          return data.items;
        })
      )
      .subscribe({
        next: (items) => {
          // Faça algo com os items aqui
          this.gridRowsPayment = items
          console.log('Items recebidos:', items);
        },
        error: (err) => {
          console.error('Erro ao obter grid:', err);
        }
      });
  }

  changeServer(data: any) {
    this.params.current_page = data.current_page-1;
    this.params.pagesize = data.pagesize;
    // this.params.sort_column = data.sort_column;
    // this.params.sort_direction = data.sort_direction;
    // this.params.search = data.search;
    // this.params.column_filters = data.column_filters;

    this.loadDetails(null)
  }

  detail(subscriptionId: string){
    console.log("subscriptionId" , subscriptionId);
    
    this.router.navigate(['/admin/payment-details/' + subscriptionId ])
  }
}
