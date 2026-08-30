import { emptyStringToNull } from '@/utils/helpers'
import { string, object, date, number } from 'yup'

export const cashVoucherValidation = object({
  date: date().required().typeError('Field required'),
  amount: number().required().typeError('Field required'),
  reason: string().required(),
  personId: object().required().typeError('Field required'),
  categoryId: object().required().typeError('Field required'),
  //departmentId: object().required().typeError("Field required"),
  number: string().optional().transform(emptyStringToNull),
})
