import { Component, Inject, OnInit } from '@angular/core';
import { SubscriptionComponent } from '../payment.component';
import { PaymentService } from 'src/app/service/payment.service';
import { CompanyService } from 'src/app/service/company.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared.module';
import { colDef } from '@bhplugin/ng-datatable';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, SharedModule, SubscriptionComponent],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent implements OnInit{

  private priceId = 'price_1RWPoLLcZMm6EvIPPHP4bj6E'; // Substitua pelo seu price_id

  companyService:CompanyService = Inject(CompanyService);

  constructor(private paymentService: PaymentService) {
    this.carregaGrid();
  }
 
  cols: Array<colDef> = [];
  gridRowsUser: any[] = []
  totalRowsUser!:number;
  params = {
    current_page: 0,
    pagesize: 10,
      // sort_column: 'id',
      // sort_direction: 'asc',
      // search: '',
      // column_filters: [],
  };

  changeServer(data: any) {
    this.params.current_page = data.current_page-1;
    this.params.pagesize = data.pagesize;
    // this.params.sort_column = data.sort_column;
    // this.params.sort_direction = data.sort_direction;
    // this.params.search = data.search;
    // this.params.column_filters = data.column_filters;

    this.carregaGrid()
  }

  carregaGrid() {
    let query = new HttpParams();
 
    query = query.append('pageIndex', this.params.current_page);
 
    query = query.append('pageSize', this.params.pagesize );
    this.paymentService.obtemGrid(query)
      .subscribe(
        (resp: any) => {
          this.gridRowsUser = resp.items;
          this.totalRowsUser = resp.total
        }
      );
  }
  ngOnInit(): void {
    // this.companyService.
    //TODO carregar a compania para saber se esta no mod trial ou não 
  }

  loadToEdit(row:any){

  }
  deleteRow(row:any){
  }
  subscribe() {
    this.paymentService.checkout(this.priceId).catch(error => {
      console.error('Erro no checkout:', error);
    })
  }


  
}
