export interface MobileOperationType {
  id: number;
  operationId: number;
  type: string;
  invoiceType: string;
  operationDate: string;
  referenceOrder: string;
  reference: string;
  amount: number;
  fee: number;
  person: string;
  personType: string;
  enterpriseId: number;
  description: string;
  paymentNumber: string;
  payObject: string;
  status: string;
}
