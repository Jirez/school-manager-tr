import { emptyStringToNull } from '@/utils/helpers'
import { string, object } from 'yup'

export const roleValidation = object({
  name: string().required('validation-name-required').min(2).max(120),
  description: string().optional().transform(emptyStringToNull),
})
