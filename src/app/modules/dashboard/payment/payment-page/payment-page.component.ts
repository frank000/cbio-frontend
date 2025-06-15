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
  imports: [CommonModule, SharedModule, SubscriptionComponent,],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent implements OnInit{

  private priceId = 'price_1RWPoLLcZMm6EvIPPHP4bj6E'; // Substitua pelo seu price_id
 
  statusPayment: string = "";

  constructor(
    private paymentService: PaymentService,
    private companyService: CompanyService 
  ) {
    this.carregaGrid();
    this.companyService.statusPayment()
    .subscribe(
      (resp : any)=>{
        this.statusPayment = resp; 
          
      }
    );
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
    this.cols = [
      { field: "subscriptionId", title: "N° Inscrição", filter: false, sort: false },
      { field: "status	", title: "Status" },
      { field: "createdAt", title: "Criado em" },

      { field: "acoes", title: "Ações" }

  ];
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
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
        case 'ativo':
        case 'active':
        case 'pago':
        case 'paid':
            return 'success';
        case 'pendente':
        case 'pending':
            return 'warning';
        case 'cancelado':
        case 'canceled':
            return 'danger';
        default:
            return 'primary';
    }
}

// MODAL
// Adicione estas propriedades na sua classe
showInvoiceModal: boolean = false;
selectedInvoice: any = null;

// Método para abrir a modal
openInvoiceModal(invoiceData: any, modalInvoiceDetails: any) {
    modalInvoiceDetails.open();
    this.selectedInvoice = invoiceData;
    this.showInvoiceModal = true;
    
    // Se precisar carregar dados adicionais da invoice:
    // this.loadInvoiceDetails(invoiceData.id);
}

// Método para fechar a modal
closeInvoiceModal() {
    this.showInvoiceModal = false;
    this.selectedInvoice = null;
}

// Método para download da invoice (opcional)
downloadInvoice() {
    if (!this.selectedInvoice) return;
    
    // Implemente a lógica de download aqui
    console.log('Downloading invoice:', this.selectedInvoice.subscriptionId);
    
    // Exemplo de chamada a um serviço:
    // this.invoiceService.downloadInvoice(this.selectedInvoice.id).subscribe(
    //     (data) => { /* tratar download */ },
    //     (error) => { /* tratar erro */ }
    // );
}

// Se precisar carregar detalhes adicionais (opcional)
/*
loadInvoiceDetails(invoiceId: string) {
    this.invoiceService.getInvoiceDetails(invoiceId).subscribe(
        (details) => {
            this.selectedInvoice = {...this.selectedInvoice, ...details};
        },
        (error) => {
            console.error('Erro ao carregar detalhes da invoice:', error);
        }
    );
}
*/
  
}
