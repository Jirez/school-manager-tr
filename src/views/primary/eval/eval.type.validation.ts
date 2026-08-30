import { emptyStringToNull } from '@/utils/helpers'
import { string, object, boolean, number } from 'yup'

export const evalTypeValidation = object({
  name: string().required('validation-name-required').min(2).max(50),
  active: boolean().required(),
  id: number().nullable(),
  description: string().nullable().transform(emptyStringToNull),
})
