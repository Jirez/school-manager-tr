import { emptyStringToNull } from '@/utils/helpers'
import { string, object, boolean } from 'yup'

export const departmentValidation = object({
  name: string().required('validation-name-required').min(2).max(50),
  manager: string().nullable(),
  active: boolean().required(),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
})
