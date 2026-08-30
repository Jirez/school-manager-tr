export interface DeductionType {
  id: number;
  code: string | null;
  name: string;
  active: boolean;
  description: string;
  calculationType: any;
  category: any;
  categoryId: any;
  enterpriseId: number;
}
