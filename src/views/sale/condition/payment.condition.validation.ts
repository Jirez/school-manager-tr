import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, boolean } from 'yup'

export const paymentConditionValidation = object({
  name: string().required().max(30),
  days: number().required().typeError('Field required'),
  description: string().transform(emptyStringToNull),
  active: boolean().required(),
  id: number().nullable(),
})
