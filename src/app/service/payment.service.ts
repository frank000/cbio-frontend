import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
 

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripePromise: Promise<Stripe | null>;
  private apiUrl = environment.urlBackend;

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe('pk_test_51QhrJxLcZMm6EvIPCAnq6C4ci4Ji4EM0LWiZPe0T8J5XSkbYRLFfyq5okIVkbTKQFHvXB2JAeOltqlFaLa9XFk9100tthCnRUT');
  }

  async checkout(priceId: string): Promise<void> {
    const stripe = await this.stripePromise;
    
    this.http.post(`${this.apiUrl}/v1/payment/create-checkout-session`, {
      priceId: priceId,
      successUrl: `${window.location.origin}/v1/payment/success`,
      cancelUrl: `${window.location.origin}/v1/payment/cancel`
    }).subscribe(async (response: any) => {
      const result = await stripe?.redirectToCheckout({
        sessionId: response.sessionId
      });

      if (result?.error) {
        console.error(result.error);
      }
    });
  }
}