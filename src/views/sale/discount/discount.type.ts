export interface DiscountType {
  id: number;
  discountType: string;
  name: string;
  value: number | "";
  note: string;
  active: boolean;
  enterpriseId: number;
}
