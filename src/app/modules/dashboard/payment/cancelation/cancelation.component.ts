import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { PaymentService } from 'src/app/service/payment.service';
import { SubscriptionData } from 'src/app/shared/models/subscription-cancellation.component';
import { SharedModule } from 'src/shared.module';

@Component({
  selector: 'app-cancelation',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './cancelation.component.html',
  styleUrl: './cancelation.component.css'
})
export class CancelationComponent implements OnInit {

  subscriptionData: SubscriptionData = {
    id: "sub_12345",
    sessionId: "sess_67890",
    customerId: "cust_abc123",
    name: "João Silva",
    email: "joao.silva@email.com",
    status: "ACTIVE",
    createdAt: "2024-01-15T10:30:00",
    updatedAt: "2024-06-01T14:20:00",
    paidAt: "2024-06-01T14:25:00",
    customerDetails: {
      phone: "(11) 99999-9999",
      document: "123.456.789-00"
    },
    subscriptionId: "subscription_xyz789",
    companyId: "company_456"
  };  

  reasons: string[] = [
    'Não uso mais o serviço',
    'Muito caro',
    'Encontrei uma alternativa melhor',
    'Problemas técnicos',
    'Atendimento insatisfatório',
    'Outro motivo'
  ];

  selectedReason: string = '';
  showModal: boolean = false;
  isLoading: boolean = false;
  constructor(private route : ActivatedRoute, private paymentService:PaymentService){

    
  }

  ngOnInit(): void {
    this.route.paramMap
    .subscribe(
      (params:any) => { 
      if(params.get('id') != undefined){
        this.loadSubscriptionData(params.get('id'));
      }
    });
    // Aqui você pode carregar os dados reais da assinatura
    // this.loadSubscriptionData();
  }
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(): string {
    return this.subscriptionData.status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  getStatusText(): string {
    return this.subscriptionData.status === 'ACTIVE' ? 'Ativa' : 'Inativa';
  }

  openConfirmationModal(): void {
    if (this.selectedReason) {
      this.showModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  async confirmCancellation(): Promise<void> {
    this.isLoading = true;
    
    try {
      // Aqui você faria a chamada para sua API
       await this.paymentService.cancel(this.subscriptionData.subscriptionId, this.selectedReason)
       .then((ok:any) => {}
       );
 
      
      // Redirecionar para outra página se necessário
      // this.router.navigate(['/subscriptions']);
      
    } catch (error) {
      this.isLoading = false;
      console.error('Erro ao cancelar assinatura:', error);
      alert('Erro ao cancelar assinatura. Tente novamente.');
    }
  }

  goBack(): void {
    // Implementar navegação de volta
    window.history.back();
  }

  private loadSubscriptionData(subscriptionId:string): void {
    this.paymentService.getSubscription(subscriptionId).subscribe({
      next: (data:any) => {
        this.subscriptionData = data;
      },
      error: (error:any) => {
        console.error('Erro ao carregar dados da assinatura:', error);
      }
    });
  }
}
