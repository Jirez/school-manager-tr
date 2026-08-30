export interface FeeGroupType {
  id: number;
  name: string;
  name2: string;
  registrationDateAfter: any;
  registrationDateBefore: any;
  birthDateAfter: any;
  birthDateBefore: any;
  gender: string | null;
  levelId: any;
  level: any;
  familyOfXAndAboveChildren: number | "";
  oneTimePayment: boolean;
  isAlumni: boolean;
  isExternalStudent: boolean;
  hasScholarship: boolean;
  isSocialCase: boolean;
  isStaffStudent: boolean;
  useAsFallback: boolean;
  isActive: boolean;
  note: string;
}
