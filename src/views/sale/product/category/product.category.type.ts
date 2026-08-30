export interface ProductCategoryType {
  id: number;
  name: string;
  active: boolean;
  description: string;
  enterpriseId: number;
  parentId: any;
  parent: ProductCategoryType;
}
