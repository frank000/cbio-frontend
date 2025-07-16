import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { colDef } from '@bhplugin/ng-datatable';
import { filter, map } from 'rxjs';
import { PaymentService } from 'src/app/service/payment.service';
import { SharedModule } from 'src/shared.module';
import { showMessage } from '../../base/showMessage';
import { TruncatePipe } from 'src/app/shared/truncate.pipe';
import { log } from 'console';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, SharedModule, TruncatePipe, RouterLink],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css'
})
export class PaymentDetailsComponent implements OnInit {
  checkoutSession: any | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('id');
    if (sessionId) {
      console.log("dentro 1");
      
      this.loadPaymentDetails(sessionId);
    }
  }

  loadPaymentDetails(sessionId: string): void {
    this.loading = true;
    this.paymentService.getCheckoutSession(sessionId).subscribe({
      next: (data:any) => {
        this.checkoutSession = data;
        this.loading = false;
      },
      error: (err:any) => {
        showMessage('Falha ao carregar detalhes do pagamento', 'error'); 
        this.loading = false;
      }
    });
  }

  cancelSubscription(): void {
    if (!this.checkoutSession?.subscriptionId) return;

    if (confirm('Tem certeza que deseja cancelar esta assinatura?')) {
      this.paymentService.cancelSubscription(this.checkoutSession.subscriptionId).subscribe({
        next: () => {
          showMessage('Assinatura cancelada com sucesso');  
          this.loadPaymentDetails(this.checkoutSession?.sessionId || '');
        },
        error: (err:any) => {
          showMessage('Falha ao cancelar assinatura', 'error'); 
        }
      });
    }
  }

  goBack(): void {
    // this.location.back();
  }
}