export interface SchoolYearType {
  id?: number;
  label: string;
  startDate: any;
  endDate: any;
  current: boolean;
  label2?: string;
  locked: boolean;
  closed: boolean;
  archived: boolean;
  cycleCount?: number;
  ageMin?: number | string | null;
  ageMax?: number | string | null;
  periodType: any;
  school: any;
}
