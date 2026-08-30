export interface GuardianType {
  id?: number;
  lastName: string;
  firstName?: string;
  displayName?: string;
  gender: any;
  profession?: string;
  active: boolean;
  note?: string;
  job?: string;
  religion?: string;
  regionOrigin?: string;
  departmentOrigin?: string;
  districtOrigin?: string;
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
  language: any;
  languageId: any;
}
