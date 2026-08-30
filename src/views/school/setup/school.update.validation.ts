import { emptyStringToNull } from '@/utils/helpers'
import * as yup from 'yup'

export const schoolSetupValidationSchema: yup.ObjectSchema<any> = yup.object({
  name2: yup.string().required().min(2).max(255),
  motto: yup.string().required().min(2).max(100),
  motto2: yup.string().required().min(2).max(100),
  registrationNumber: yup.string().optional().transform(emptyStringToNull),
  telephone: yup
    .string()
    .optional()
    .min(9)
    .max(64)
    .transform(emptyStringToNull),
  postOfficeBox: yup
    .string()
    .optional()
    .min(2)
    .max(64)
    .transform(emptyStringToNull),
  schoolType: yup.string().required(),
  schoolCategory: yup.string().required(),
  studentType: yup.string().required(),
  town: yup.string().required().min(2).max(50),
  schoolCode: yup.string().required().min(2).max(10),
})
