import { emptyStringToNull } from '@/utils/helpers'
import { string, ObjectSchema, object, number } from 'yup'

export const logCodeValidationSchema: ObjectSchema<any> = object({
  name: string().required('validation-name-required').min(2).max(50),
  logType: object().required(),
  id: number().optional(),
  note: string().optional().min(2).max(255).transform(emptyStringToNull),
})
