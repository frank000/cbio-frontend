import { Component, Inject, OnInit } from '@angular/core';
import { SubscriptionComponent } from '../payment.component';
import { PaymentService } from 'src/app/service/payment.service';
import { CompanyService } from 'src/app/service/company.service';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [SubscriptionComponent],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent implements OnInit{

  private priceId = 'price_1RWPoLLcZMm6EvIPPHP4bj6E'; // Substitua pelo seu price_id

  companyService:CompanyService = Inject(CompanyService);

  constructor(private paymentService: PaymentService) {}


  ngOnInit(): void {
    // this.companyService.
    //TODO carregar a compania para saber se esta no mod trial ou não 
  }


  subscribe() {
    this.paymentService.checkout(this.priceId).catch(error => {
      console.error('Erro no checkout:', error);
    })
  }


  
}
