export interface QuarterlyCompNoteType {
  studentId: number;
  studentFullName: string;
  registrationNumber: string;
  items: QuarterlyCompNoteItem[];
}

interface QuarterlyCompNoteItem {
  competenceId: number;
  numberOrder: number;
  note: string;
}
