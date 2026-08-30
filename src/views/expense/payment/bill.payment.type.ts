export interface BillPaymentType {
  id: number;
  operationDate: any;
  number?: string;
  note: string;
  supplier: any;
  supplierId: any;
  paymentMode: any;
  paymentModeId: any;
  paymentAccount: any;
  paymentAccountId: any;
  amount: number | string;
  amountF: number | string;
  items: PaymentItem[];
  balance: any;
}

export interface PaymentItem {
  id: number;
  amount: number;
  balance: number;
  bill: {
    id: number;
    number: string;
    operationDate: string;
  };
  description: string;
  deadline: string;
  paidAmount: number | string;
  paidAmountF: number | string;
  type: string;
}
