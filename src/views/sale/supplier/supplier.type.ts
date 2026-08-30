export interface SupplierType {
  id: number;
  lastName: string;
  firstName: string;
  displayName: string;
  address: {
    street?: string;
    state?: string;
    country?: string;
    town?: string;
    zipCode?: string;
  };
  contactInfo: {
    telephone?: string;
    email?: string;
    postOfficeBox?: string;
    mobile?: string;
    fax?: string;
  };
  active: boolean;
  note: string;
  birthdate: string;
  webSite: string;
  taxNumber: string;
  tradeRegister: string;
  rating: string;
  purchaseCondition: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  supplierAccount: {
    id: number;
    name: string;
  };
  categoryId: any;
  supplierAccountId: any;
  purchaseConditionId: any;
  birthDate: any;
}
