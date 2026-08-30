export interface PFreeSequentialNoteType {
  studentId: number;
  registrationNumber: string;
  studentFullName: string;
  items: PFreeSequentialNoteItemType[];
}

export interface PFreeSequentialNoteItemType {
  subPeriodId: number;
  subPeriodName: string;
  items: PFreeSequentialNoteItemItemType[];
}

export interface PFreeSequentialNoteItemItemType {
  evalTypeId: number;
  evalTypeName: string;
  note: number;
  marks: number;
}
