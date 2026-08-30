import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number } from 'yup'

export const schoolOfficialValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(50),
  liableTypeId: object().required(),
  id: number().optional(),
  email: string().optional().transform(emptyStringToNull),
})
