export interface BankTransactionType {
  id: number;
  type: string;
  status: string;
  referenceNumber: string;
  transactionDate: any;
  amount: number | string;
  amountF: number | string;
  description: string;
  bankAccount: {
    id: number;
    name: string;
  };
  account: {
    id: number;
    name: string;
    number: string;
  };
  accountId: any;
  bankAccountId: any;
}
