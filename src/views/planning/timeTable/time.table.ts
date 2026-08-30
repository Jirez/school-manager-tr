export interface TimeTableForm {
  timeSlotId: number;
  startTime: string;
  endTime: string;
  timeSlot: string;
  items: [TimeTableFormItem];
}

export interface TimeTableFormItem {
  dayOfClassId: number;
  dayOfWeek: string;
  subjectId: number;
  subjectName: string;
  available: boolean;
  teacherId: number;
}
