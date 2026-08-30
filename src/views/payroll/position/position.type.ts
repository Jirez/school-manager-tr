export interface PositionType {
  id: number;
  title: string;
  active: boolean;
  baseSalaryF: number | string | null;
  baseSalary: number | string | null;
  bonusPercentage: number | string | null;
  overtimeRate: number | string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
}
