import { emptyStringToNull } from '@/utils/helpers'
import { object, number, date, string } from 'yup'

export const studentInvoiceValidationSchema = object({
  studentId: number().required(),
  operationDate: date().required().typeError('Field required'),
  id: number().optional(),
  reference: string().transform(emptyStringToNull),
})
