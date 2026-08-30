import { string, object, number, boolean } from 'yup'
import { emptyStringToNull } from '@/utils/helpers'

export const supplierCategoryValidation = object({
  name: string().required('validation-name-required').min(2).max(120),
  active: boolean().required(),
  description: string()
    .optional()
    .min(2)
    .max(2500)
    .transform(emptyStringToNull),
  id: number().optional(),
  parentId: object().nullable().optional(),
})
