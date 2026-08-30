import { emptyStringToNull } from '@/utils/helpers'
import { string, object, date } from 'yup'

export const billValidation = object({
  operationDate: date().required().typeError('Field required'),
  deadline: date().required().typeError('Field required'),
  supplierId: object().required().typeError('Field required'),
  note: string().optional().transform(emptyStringToNull),
  number: string().optional().transform(emptyStringToNull),
})
