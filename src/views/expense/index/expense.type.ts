export interface ExpenseType {
  id: number;
  operationDate: any;
  number: string;
  voucher: any;
  voucherId: any;
  paymentMode: any;
  paymentModeId: any;
  paymentAccount: any;
  paymentAccountId: any;
  department: any;
  departmentId: any;
  note: string;
  items: ExpenseItem[];
  amount: number;
  quantity: number;
}

export interface ExpenseItem {
  id?: number;
  expenseId?: number;
  category: {
    id: number;
    name: string;
  };
  person: {
    id: number;
    displayName: string;
  };
  personId: any;
  quantity: number | string;
  unitPrice: number | string;
  quantityF: number | string;
  unitPriceF: number | string;
  description: string;
  operationClass: {
    id: number;
    name: string;
  };
  total: number;
  operationClassId: any;
}
