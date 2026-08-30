export interface InstallmentType {
  id: number;
  numberOrder: number;
  name: string;
  name2: string;
  dueDate: any;
  gracePeriodDays: number | "";
  lateFeePercentage: number | "";
  isActive: boolean;
  isRefundable: boolean;
  note: string;
}
