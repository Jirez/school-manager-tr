import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number } from 'yup'

export const accountModelValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(50),
  code: string().required(),
  languageType: object().required(),
  id: number().optional(),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
})
