import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number } from 'yup'

export const guardianValidationSchema = object({
  lastName: string().required('validation-name-required').min(2).max(120),
  firstName: string().optional().min(2).max(60).transform(emptyStringToNull),
  languageId: object().required().typeError('Field required'),
  gender: object().required().typeError('Field required'),
  id: number().optional(),
  profession: string().optional().min(2).max(60).transform(emptyStringToNull),
  job: string().optional().min(2).max(60).transform(emptyStringToNull),
  religion: string().optional().min(2).max(50).transform(emptyStringToNull),
  regionOrigin: string().optional().min(2).max(50).transform(emptyStringToNull),
  departmentOrigin: string()
    .optional()
    .min(2)
    .max(50)
    .transform(emptyStringToNull),
  districtOrigin: string()
    .optional()
    .min(2)
    .max(50)
    .transform(emptyStringToNull),
  contactInfo: object({
    telephone: string().optional().min(9).max(64).transform(emptyStringToNull),
    fax: string().optional().min(9).max(64).transform(emptyStringToNull),
    mobile: string().optional().min(9).max(64).transform(emptyStringToNull),
    email: string().optional().min(6).max(60).transform(emptyStringToNull),
    postOfficeBox: string()
      .optional()
      .min(2)
      .max(64)
      .transform(emptyStringToNull),
  }),
  address: object({
    town: string().optional().min(2).max(50).transform(emptyStringToNull),
    state: string().optional().min(2).max(50).transform(emptyStringToNull),
    street: string().optional().min(2).max(50).transform(emptyStringToNull),
    country: string().optional().min(2).max(50).transform(emptyStringToNull),
    zipCode: string().optional().min(3).max(5).transform(emptyStringToNull),
  }),
})
