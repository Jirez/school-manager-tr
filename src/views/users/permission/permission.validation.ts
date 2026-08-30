import { emptyStringToNull } from '@/utils/helpers'
import { string, ObjectSchema, object } from 'yup'

export const permissionValidation: ObjectSchema<any> = object({
  code: string().required(),
  description: string().optional().min(5).max(255).transform(emptyStringToNull),
})
