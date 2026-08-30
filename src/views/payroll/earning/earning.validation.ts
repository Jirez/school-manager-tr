import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, boolean } from 'yup'

export const earningValidation = object({
  code: string().nullable().min(1).max(15),
  name: string().required().min(2).max(60),
  calculationType: string().required(),
  id: number().nullable(),
  active: boolean().required().typeError('Field required'),
  isTaxable: boolean().required().typeError('Field required'),
  isOvertime: boolean().required().typeError('Field required'),
  description: string().nullable().min(2).max(255).transform(emptyStringToNull),
  categoryId: object().required().typeError('Field required'),
})
