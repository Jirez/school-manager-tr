import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, boolean } from 'yup'

export const earningCategoryValidation = object({
  name: string().required().min(2).max(60),
  numberOrder: number().required().min(1),
  id: number().nullable(),
  active: boolean().required().typeError('Field required'),
  description: string().nullable().min(2).max(255).transform(emptyStringToNull),
})
