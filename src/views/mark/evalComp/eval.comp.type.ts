interface EvalCompType0 {
  classId: number;
  periodId: number;
  subjectId: number;
  subjectName: string;
  numberOrder?: number;
  competence: string;
}

export interface EvalCompType {
  subjectId: number;
  //name: string;
  classId: number;
  periodId: number;
  subjectName: string;
  items: EvalCompItem[];
}

interface EvalCompItem {
  id: number;
  numberOrder: number;
  competence: string;
  active: boolean;
}
