export interface EarningType {
  id: number;
  code: string | null;
  name: string;
  active: boolean;
  description: string;
  isTaxable: boolean;
  isOvertime: boolean;
  calculationType: any;
  category: any;
  categoryId: any;
  enterpriseId: number;
}
