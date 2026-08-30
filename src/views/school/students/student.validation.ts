import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, date } from 'yup'

export const studentValidationSchema = object({
  lastName: string().required('validation-name-required').min(2).max(120),
  firstName: string().optional().min(2).max(60).transform(emptyStringToNull),
  birthDate: date().required().typeError('Field required'),
  birthplace: string().required(),
  gender: object().required().typeError('Field required'),
  registrationNumber: string()
    .optional()
    .min(2)
    .max(15)
    .transform(emptyStringToNull),
  id: number().optional(),
  religion: string().optional().min(2).max(50).transform(emptyStringToNull),
  knownHealthProblem: string()
    .optional()
    .min(2)
    .max(255)
    .transform(emptyStringToNull),
  otherUsefulInfo: string()
    .optional()
    .min(2)
    .max(255)
    .transform(emptyStringToNull),
  ethnicGroup: string().optional().min(2).max(120).transform(emptyStringToNull),
  bloodGroup: string().optional().min(1).max(30).transform(emptyStringToNull),
  rhesus: string().optional().min(1).max(30).transform(emptyStringToNull),
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
  origin: object({
    departmentOrigin: string()
      .optional()
      .min(2)
      .max(50)
      .transform(emptyStringToNull),
    regionOrigin: string()
      .optional()
      .min(2)
      .max(50)
      .transform(emptyStringToNull),
    districtOrigin: string()
      .optional()
      .min(2)
      .max(50)
      .transform(emptyStringToNull),
    countryOrigin: string()
      .optional()
      .min(2)
      .max(50)
      .transform(emptyStringToNull),
  }),
})

export const contactInfoValidationSchema = object({
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
})

export const addressValidationSchema = object({
  address: object({
    town: string().optional().min(2).max(50).transform(emptyStringToNull),
    state: string().optional().min(2).max(50).transform(emptyStringToNull),
    street: string().optional().min(2).max(50).transform(emptyStringToNull),
    country: string().optional().min(2).max(50).transform(emptyStringToNull),
    zipCode: string().optional().min(3).max(5).transform(emptyStringToNull),
  }),
})

export const originValidationSchema = object({
  origin: object({
    departmentOrigin: string()
      .optional()
      .min(2)
      .max(50)
      .transform(emptyStringToNull),
    regionOrigin: string()
      .optional()
      .min(2)
      .max(50)
      .transform(emptyStringToNull),
    districtOrigin: string()
      .optional()
      .min(2)
      .max(50)
      .transform(emptyStringToNull),
    countryOrigin: string()
      .optional()
      .min(2)
      .max(50)
      .transform(emptyStringToNull),
  }),
})
