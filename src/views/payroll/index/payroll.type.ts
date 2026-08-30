export interface PayrollType {
  id: number;
  number: string;
  baseSalary: number | string;
  baseSalaryF: number | string;
  grossSalary: number | string;
  netSalary: number | string;
  totalEmployeeDeduction: number;
  operationDate: any;
  note: string | null;
  enterpriseId: number;
  employee: any;
  period: any;
  employeeId: any;
  periodId: any;
  earnings: PayrollItem[];
  deductions: PayrollItem[];
  employerDeductions: PayrollItem[];
  status: string;
  paymentModeId: any;
  paymentMode: any;
}

export interface PayrollItem {
  id: number;
  baseF: number;
  base: number;
  rateF: number;
  rate: number;
  description: string;
  item: {
    id: number;
    name: string;
  };
  total: number;
  isTaxable: boolean;
}
