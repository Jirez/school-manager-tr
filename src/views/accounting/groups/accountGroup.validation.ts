import { emptyStringToNull } from '@/utils/helpers'
import { string, ObjectSchema, object, number } from 'yup'

export const accountGroupValidationSchema: ObjectSchema<any> = object({
  name: string().required('validation-name-required').min(2).max(50),
  sectionType: object().required(),
  id: number().optional(),
  description: string().optional().min(5).max(255).transform(emptyStringToNull),
})
