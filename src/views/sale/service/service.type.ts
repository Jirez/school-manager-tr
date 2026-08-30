export interface ServiceType {
  id: number;
  serviceId: number;
  name: string;
  sku: string;
  active: boolean;
  productCategory: any;
  productCategoryId: any;
  productType: string;
  salePrice: number | string;
  salePriceF: number | string;
  purchasePrice: number | string;
  purchasePriceF: number | string;
  quantity: number;
  cost: number | string;
  costF: number | string;
  purchaseDescription: string;
  saleDescription: string;
  picture: string;
  saleAccount: any;
  saleAccountId: any;
  purchaseAccount: any;
  purchaseAccountId: any;
  hourCount: string | number;
}
