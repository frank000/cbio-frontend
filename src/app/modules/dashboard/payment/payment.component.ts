import { CommonModule } from "@angular/common"; 
import { Component } from "@angular/core";
import { PaymentService } from "src/app/service/payment.service";
import { SharedModule } from "src/shared.module";

 

@Component({
  selector: 'app-subscription',
  imports: [CommonModule, SharedModule],
  standalone: true,
  template: `
    <button (click)="subscribe()">Assinar Plano Básico por R$129/mês</button>
  `
})
export class SubscriptionComponent {
  private priceId = 'price_1RWPoLLcZMm6EvIPPHP4bj6E'; // Substitua pelo seu price_id

  constructor(private paymentService: PaymentService) {}

  subscribe() {
    this.paymentService.checkout(this.priceId).catch(error => {
      console.error('Erro no checkout:', error);
    });
  }
}