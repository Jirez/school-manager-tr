export interface PSequentialNoteType {
  studentId: number;
  registrationNumber: string;
  studentFullName: string;
  items: PSequentialNoteItemType[];
}

export interface PSequentialNoteItemType {
  evalTypeId: number;
  evalTypeName: string;
  note: number;
  marks: number;
}
