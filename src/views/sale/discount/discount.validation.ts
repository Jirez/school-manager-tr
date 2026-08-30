import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, boolean } from 'yup'

export const DiscountValidationSchema = object({
  name: string().required(),
  id: number().nullable(),
  discountType: string().required(),
  value: number().required().typeError('Field required'),
  note: string().nullable().transform(emptyStringToNull),
  active: boolean().required(),
})
