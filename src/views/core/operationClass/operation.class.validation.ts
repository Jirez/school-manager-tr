import { string, object, number, boolean } from 'yup'
import { emptyStringToNull } from '@/utils/helpers'

export const operationClassValidation = object({
  name: string().required('validation-name-required').min(2).max(60),
  description: string().optional().min(2).max(255).transform(emptyStringToNull),
  id: number().optional(),
  active: boolean().required(),
})
