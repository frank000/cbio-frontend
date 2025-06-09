import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CrudAbstractService } from './crud.service';
 

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends CrudAbstractService{

  override getControllerName(): string {
        return "payment"
  }

  private stripePromise: Promise<Stripe | null>;
  private apiUrl = environment.urlBackend;

  constructor(private http: HttpClient) {
    super();
    this.stripePromise = loadStripe('pk_test_51QhrJxLcZMm6EvIPCAnq6C4ci4Ji4EM0LWiZPe0T8J5XSkbYRLFfyq5okIVkbTKQFHvXB2JAeOltqlFaLa9XFk9100tthCnRUT');
  }
  public getSubscription(subscriptionId:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/v1/payment/subscriptions/${subscriptionId}` );
  }


   
  async getAllSubscription(){
    return this.http.get(`${this.apiUrl}/v1/payment/subscriptions` );

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
 

  async cancel(subscriptionIdid:any, reason:string){
    const params = new HttpParams()
    .set('subscriptionId', subscriptionIdid)
    .set('reason', reason);

    this.http.post(`${this.apiUrl}/v1/payment/subscriptions/cancel`, null, {params})
    .subscribe(async (response: any) => {
 
    });
  }
}