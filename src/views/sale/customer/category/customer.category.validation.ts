import { string, object, number, boolean } from 'yup'
import { emptyStringToNull } from '@/utils/helpers'

export const customerCategoryValidation = object({
  name: string().required('validation-name-required').min(2).max(100),
  active: boolean().required(),
  description: string().optional().min(2).max(255).transform(emptyStringToNull),
  id: number().optional(),
})
