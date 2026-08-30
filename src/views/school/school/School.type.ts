export interface SchoolType {
  id?: number;
  name: string;
  name2?: string;
  registrationNumber?: string;
  shortName?: string;
  schoolCode?: string;
  schoolType?: string;
  schoolCategory?: string;
  studentType?: string;
  motto?: string;
  webSite?: string;
  note?: string;
  logo?: string;
  active: boolean;
  motto2?: string;
  creationDate: any;
  address?: {
    state?: string;
    street?: string;
    town?: string;
    country?: string;
    zipCode?: string;
  };
  contactInfo?: {
    telephone?: string;
    mobile?: string;
    email?: string;
    fax?: string;
    postOfficeBox?: string;
  };
  legalInfo?: {
    legalForm?: string;
    taxpayerNumber?: string;
    tradeRegister?: string;
    shareCapital?: string;
  };
  authNumber?: string;
  nsifNumber?: string;
  venue?: string;
  signingAddress?: string;
  bilingualName?: string;
  identifier?: string;
}
