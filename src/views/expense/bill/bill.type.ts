export interface BillType {
  id: any;
  operationId: number;
  number: string;
  originalNumber: string;
  invoiceType: string;
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
  supplier: any;
  supplierId: any;
  enterpriseId: number;
  voucher: any;
  voucherId: any;
  department: any;
  departmentId: any;
  items: BillItem[];
}

export interface BillItem {
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
  operationClassId: number;
}
