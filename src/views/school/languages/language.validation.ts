import { emptyStringToNull } from '@/utils/helpers'
import { string, object, boolean, number } from 'yup'

export const languageValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(20),
  code: string().required(),
  active: boolean().required(),
  id: number().optional(),
  description: string().optional().min(5).max(255).transform(emptyStringToNull),
})
