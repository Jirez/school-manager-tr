import * as yup from "yup";
import { studentValidationSchema } from "../students/student.validation";

export const frequentValidation: yup.ObjectSchema<any> = yup.object({
  studentId: yup.number().required(),
  student: yup.string().required(),
  classId: yup.object().required().typeError("Field required"),
});

export const frequentUpdateValidation = yup.object({
  ...studentValidationSchema.fields,
  classId: yup.object().required().typeError("Field required"),
});

export const frequentExcludeValidation = yup.object({
  exclusionDate: yup.string().required("Field required"),
  exclusionReason: yup.string().required("Field required"),
  excluded: yup.boolean().required(),
});
