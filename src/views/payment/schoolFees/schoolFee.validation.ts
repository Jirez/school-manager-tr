import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, boolean } from 'yup'

export const schoolFeeValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(60),
  name2: string().required('validation-name-required').min(2).max(60),
  numberOrder: number().required(),
  active: boolean().required(),
  mandatory: boolean().required(),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
  id: number().optional(),
})
