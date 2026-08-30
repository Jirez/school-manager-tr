import { emptyStringToNull } from '@/utils/helpers'
import { string, object, date, number } from 'yup'

export const billPaymentValidation = object({
  operationDate: date().required().typeError('Field required'),
  supplierId: object().required().typeError('Field required'),
  paymentAccountId: object().required().typeError('Field required'),
  note: string().optional().transform(emptyStringToNull),
  number: string().optional().transform(emptyStringToNull),
  amount: number().required().transform(emptyStringToNull),
})
