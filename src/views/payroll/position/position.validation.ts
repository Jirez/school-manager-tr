import { emptyStringToNull } from '@/utils/helpers'
import { string, object, boolean, number } from 'yup'

export const positionValidation = object({
  title: string().required('validation-name-required').min(2).max(50),
  active: boolean().required(),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
  baseSalary: number().nullable().optional().transform(emptyStringToNull),
  //bonusPercentage: number().nullable(),
  //overtimeRate: number().nullable(),
})
