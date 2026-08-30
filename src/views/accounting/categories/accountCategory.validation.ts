import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number } from 'yup'

export const accountCategoryValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(50),
  accountType: object().required(),
  id: number().optional(),
  description: string()
    .optional()
    .min(5)
    .max(2500)
    .transform(emptyStringToNull),
})
