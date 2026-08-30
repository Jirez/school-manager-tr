export interface SubCompetenceType {
  competenceId: number;
  competenceName: string;
  schoolId: number;
  items: SubCompetenceItem[];
}

export interface SubCompetenceItem {
  subCompetenceId: number;
  code: string;
  name: string;
  active: boolean;
  optional: boolean;
  items: SubCompetenceItemItem[];
}

export interface SubCompetenceItemItem {
  id: number;
  evalTypeId: number;
  evalTypeName: string;
  marks: number;
}
