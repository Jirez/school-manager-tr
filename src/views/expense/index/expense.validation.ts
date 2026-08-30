import { emptyStringToNull } from '@/utils/helpers'
import { string, object, date } from 'yup'

export const expenseValidation = object({
  operationDate: date().required().typeError('Field required'),
  voucherId: object().nullable(),
  paymentModeId: object().required().typeError('Field required'),
  paymentAccountId: object().required().typeError('Field required'),
  note: string().optional().transform(emptyStringToNull),
  number: string().nullable().optional().transform(emptyStringToNull),
})
