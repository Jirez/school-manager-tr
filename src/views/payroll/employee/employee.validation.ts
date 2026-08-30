import { string, ObjectSchema, object, number } from "yup";

export const employeeValidation: ObjectSchema<any> = object({
  nsifNumber: string().nullable().max(20),
  //hireDate: string().required("validation-hireDate-required").min(2).max(50),
  //terminationDate: string().nullable(),
  employmentStatus: string().required("validation-employmentStatus-required"),
  employmentType: string().required("validation-employmentType-required"),
  payType: string().required("validation-payType-required"),
  baseSalary: number().nullable(),
  hourlySalary: number().nullable(),
  departmentId: object().nullable(),
  positionId: object().nullable(),
  personnelId: object().required().required("validation-personnel-required"),
});
