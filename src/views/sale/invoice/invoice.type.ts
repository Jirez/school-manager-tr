export interface InvoiceType {
  id: any;
  operationId: number;
  number: string;
  invoiceType: any;
  operationDate: any;
  deadline: any;
  amount: number;
  balance: number;
  quantity: number;
  distinctProduct: number;
  discount: number;
  note: string;
  condition: any;
  conditionId: any;
  person: any;
  personId: any;
  enterpriseId: number;
  depositAccount: any;
  depositAccountId: any;
  items: InvoiceItem[];
  customer: string;
  personType: any;
  className: string;
}

export interface InvoiceItem {
  id: number;
  product: {
    id: number;
    sku: string;
    name: string;
  };
  quantity: number | string;
  unitPrice: number | string;
  quantityF: number | string;
  unitPriceF: number | string;
  inStock: number;
  discount: number;
  description: string;
  total: number;
}
