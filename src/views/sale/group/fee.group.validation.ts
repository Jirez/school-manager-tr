import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, boolean, date } from 'yup'

export const feeGroupValidation = object({
  name: string().required('validation-name-required').min(2).max(50),
  name2: string().nullable().min(2).max(50),
  registrationDateAfter: date().nullable(),
  registrationDateBefore: date().nullable(),
  birthDateAfter: date().nullable(),
  birthDateBefore: date().nullable(),
  gender: string().nullable(),
  //levelId: number().optional(),
  familyOfXAndAboveChildren: number()
    .nullable()
    .optional()
    .transform(emptyStringToNull),
  oneTimePayment: boolean().required(),
  isAlumni: boolean().required(),
  isExternalStudent: boolean().required(),
  hasScholarship: boolean().required(),
  isSocialCase: boolean().required(),
  isStaffStudent: boolean().required(),
  useAsFallback: boolean().required(),
  isActive: boolean().required(),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
  id: number().optional(),
})
