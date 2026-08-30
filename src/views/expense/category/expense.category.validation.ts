import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, boolean } from 'yup'

export const expenseCategoryValidation = object({
  name: string().required(),
  id: number().nullable(),
  maxAllowedAmount: number().nullable().optional().transform(emptyStringToNull),
  active: boolean().required(),
  description: string().nullable().min(5).max(255).transform(emptyStringToNull),
  accountId: object().required().typeError('Field required'),
})
