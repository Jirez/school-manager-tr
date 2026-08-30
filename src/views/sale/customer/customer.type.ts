export interface CustomerType {
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
  prefix: string;
  paymentCondition: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  customerAccount: {
    id: number;
    name: string;
  };
  categoryId: any;
  customerAccountId: any;
  paymentConditionId: any;
  birthDate: any;
  paymentMode: any;
  paymentModeId: any;
}
