export interface HeadDepartmentType {
  headDepartmentPK: {
    schoolYearId: number;
    departmentId: number;
  };
  teacher?: {
    id: number | null;
    firstName?: string;
    lastName: string;
    code: string;
  };

  department?: {
    id: number;
    name: string;
  };
  teacherId?: number;
  lastName?: string;
}
