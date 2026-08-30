export interface DeductionCategoryType {
  id: number;
  numberOrder: number | null;
  name: string;
  active: boolean;
  description: string;
  mandatory: boolean;
  enterpriseId: number;
}
