import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, date, array } from 'yup'
import {
  addressValidationSchema,
  contactInfoValidationSchema,
  originValidationSchema,
} from '../students/student.validation'

export const teacherValidationSchema = object({
  lastName: string().required('validation-name-required').min(2).max(120),
  firstName: string().optional().min(2).max(60).transform(emptyStringToNull),
  // birthDate: date().optional(),
  birthplace: string().optional().transform(emptyStringToNull),
  gender: object().required('validation.gender-required'),
  registrationNumber: string().optional().transform(emptyStringToNull),
  code: string().required(),
  grading: number().optional().transform(emptyStringToNull),
  dueHours: number().positive().optional().transform(emptyStringToNull),
  childrenCount: number().positive().optional().transform(emptyStringToNull),
  academicYear: number().min(1960).positive().optional(),
  professionalYear: number()
    .min(1960)
    .positive()
    .optional()
    .transform(emptyStringToNull),
  subjectDepartmentIds: array().nullable().typeError('Field required'),
  ...contactInfoValidationSchema.fields,
  ...addressValidationSchema.fields,
  ...originValidationSchema.fields,
  currentPost: string().optional().min(2).max(50).transform(emptyStringToNull),
  function: string().optional().min(2).max(50).transform(emptyStringToNull),
  clazz: string().optional().min(1).max(50).transform(emptyStringToNull),
  speciality: string().optional().min(2).max(60).transform(emptyStringToNull),
  rank: string().optional().min(1).max(30).transform(emptyStringToNull),
  academicDiploma: string()
    .optional()
    .min(2)
    .max(60)
    .transform(emptyStringToNull),
  professionalDiploma: string()
    .optional()
    .min(2)
    .max(60)
    .transform(emptyStringToNull),
  fatherName: string().optional().min(2).max(120).transform(emptyStringToNull),
  motherName: string().optional().min(2).max(120).transform(emptyStringToNull),
  category: string().optional().min(1).max(30).transform(emptyStringToNull),
  motherProfession: string()
    .optional()
    .min(2)
    .max(50)
    .transform(emptyStringToNull),
  fatherProfession: string()
    .optional()
    .min(2)
    .max(50)
    .transform(emptyStringToNull),
  spouseProfession: string()
    .optional()
    .min(2)
    .max(50)
    .transform(emptyStringToNull),
  bloodGroup: string().optional().min(1).max(30).transform(emptyStringToNull),
  rhesus: string().optional().min(1).max(30).transform(emptyStringToNull),
  professionalPlace: string()
    .optional()
    .min(2)
    .max(60)
    .transform(emptyStringToNull),
  firstServicePlace: string()
    .optional()
    .min(2)
    .max(60)
    .transform(emptyStringToNull),
  academicPlace: string()
    .optional()
    .min(2)
    .max(60)
    .transform(emptyStringToNull),
  cniNumber: string().optional().min(9).max(20).transform(emptyStringToNull),
  ethnicGroup: string().optional().min(1).max(30).transform(emptyStringToNull),
  religion: string().optional().min(1).max(30).transform(emptyStringToNull),
  numberAssignment: string()
    .optional()
    .min(2)
    .max(255)
    .transform(emptyStringToNull),
  currentPicture: string().optional().nullable().transform(emptyStringToNull),
})
