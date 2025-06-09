export interface CustomerDetails {
    phone?: string;
    document?: string;
  }
  
export interface SubscriptionData {
    id: string;
    sessionId: string;
    customerId: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    paidAt: string;
    customerDetails?: CustomerDetails;
    urlHostedInvoice?: string;
    urlInvoicePdf?: string;
    subscriptionId: string;
    companyId: string;
  }