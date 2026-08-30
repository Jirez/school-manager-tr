export interface ExpenseCategoryType {
  id: number;
  name: string;
  active: boolean;
  maxAllowedAmount: number | string;
  description: string;
  accountId: any;
  account: any;
}
