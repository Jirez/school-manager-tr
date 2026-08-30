export interface StudentType {
  id?: number;
  registrationNumber: string;
  gender: any;
  lastName: string;
  firstName?: string;
  birthDate: any;
  birthplace: string;
  presumeBirthDate: boolean;
  active: boolean;
  note?: string;
  inscriptionMode?: string;
  knownHealthProblem?: string;
  rhesus?: string;
  religion?: string;
  ethnicGroup?: string;
  bloodGroup?: string;
  otherUsefulInfo?: string;
  origin: {
    countryOrigin?: string;
    districtOrigin?: string;
    departmentOrigin?: string;
    regionOrigin?: string;
  };
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
  picture: string | null;
  createdDate: string;
  items: StudentGuardian[];
}

export interface StudentGuardian {
  studentGuardianPK: {
    studentId?: number;
    guardianId?: number | string | null;
  };
  guardian?: {
    id: number;
    lastName: string;
    firstName?: string;
    profession?: string;
    displayName: string;
  };
  relation?: string | Record<string, string>;
}

export const relationOptions = [
  { label: "TUTOR", value: "TUTOR" },
  { label: "SPOUSE", value: "SPOUSE" },
  { label: "UNCLE", value: "UNCLE" },
  { label: "AUNT", value: "AUNT" },
  { label: "GRAND_FATHER", value: "GRAND_FATHER" },
  { label: "GRAND_MOTHER", value: "GRAND_MOTHER" },
  { label: "BROTHER", value: "BROTHER" },
  { label: "GRAND_UNCLE", value: "GRAND_UNCLE" },
  { label: "GRAND_AUNT", value: "GRAND_AUNT" },
  { label: "COUSIN", value: "COUSIN" },
  { label: "STEPFATHER", value: "STEPFATHER" },
  { label: "STEPMOTHER", value: "STEPMOTHER" },
];
