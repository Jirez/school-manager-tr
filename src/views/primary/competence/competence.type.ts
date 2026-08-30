export interface CompetenceType {
  id: number;
  name: string;
  description: string;
  active: boolean;
  levelId: any;
  numberOrder: number;
  marks: number;
  level: any;
}

export interface CompetenceLevelType {
  levelId: number;
  levelName: string;
  schoolId: number;
  items: CompetenceLevelItem[];
}

interface CompetenceLevelItem {
  competenceId: number;
  numberOrder: number;
  name: string;
  marks: number;
  description: string;
  active: boolean;
}
