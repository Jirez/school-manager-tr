export interface FrequentType {
  studentId: any;
  student: string;
  classId: any;
  clazz: any;
  repeater: boolean;
  numberOrder: any;
  formerStudent: boolean;
  external: boolean;
  apt: boolean;
  smsTo: string;
  mailTo: string;
  oldSchool: any;
  oldSchoolId: any;
  paymentGroup: any;
  paymentGroupId: any;
  feeGroup: any;
  feeGroupId: any;
  socialCase: boolean;
  scNature?: string;
  scObservation?: string;
  totalRequiredAmount: number;
  totalPaidAmount: number;
  lastPaymentDate: string;
}

export interface FrequentUpdateType {
  classId: any;
  clazz: any;
  repeater: boolean;
  numberOrder: any;
  formerStudent: boolean;
  external: boolean;
  apt: boolean;
  smsTo: string;
  mailTo: string;
  oldSchool: any;
  oldSchoolId: any;
  paymentGroup: any;
  paymentGroupId: any;
  feeGroup: any;
  feeGroupId: any;
  student: any;
  socialCase: boolean;
  scNature?: string;
  scObservation?: string;
}

export interface FrequentBulkUpdateType {
  studentId: number;
  lastName: string;
  firstName: string;
  birthDate: any;
  birthplace: string;
  registrationNumber: string;
}

export interface FrequentBulkImportType {
  studentId: number;
  lastName: string;
  firstName: string;
  birthDate: any;
  birthplace: string;
  registrationNumber: string;
  gender: string;
  repeater: string;
}

export interface FrequentExcludeInput {
  studentId: number;
  schoolYearId: number;
  classId: number;
  reason: string;
  exclusionDate: any;
  exclusionReason: string;
  excluded: boolean;
}
