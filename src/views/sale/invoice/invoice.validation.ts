import { emptyStringToNull } from '@/utils/helpers'
import { string, object, date } from 'yup'

export const invoiceValidation = object({
  operationDate: date().required().typeError('Field required'),
  deadline: date().required().typeError('Field required'),
  personId: object().required().typeError('Field required'),
  note: string().optional().transform(emptyStringToNull),
  number: string().optional().transform(emptyStringToNull),
})
