import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number } from 'yup'

export const officialFunctionValidation = object({
  name: string().required('validation-name-required').min(2).max(60),
  prefix: string().required().min(2).max(5),
  id: number().optional(),
  note: string().optional().min(2).max(255).transform(emptyStringToNull),
})
