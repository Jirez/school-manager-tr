export interface BankAccountType {
  id: number;
  name: string;
  number: string;
  balance: number;
  openingBalance: number | "";
  type: string;
  status: string;
  overdraftLimit: number | "";
  interestRate: number | "";
  openedDate: any;
  closedDate: any;
  account: {
    id: number;
    number: string;
    name: string;
  };
  accountId: any;
  enterpriseId: number;
  createdAt: string;
  updatedAt: string;
}
