export interface PaymentConditionType {
  id: number;
  name: string;
  active: boolean;
  days: number | "";
  description: string;
  enterpriseId: number;
}
