import { emptyStringToNull } from '@/utils/helpers'
import { object, number, date, string } from 'yup'

export const studentPaymentValidationSchema = object({
  studentId: number().required(),
  paymentDate: date().required().typeError('Field required'),
  id: number().optional(),
  note: string().nullable().min(5).max(255).transform(emptyStringToNull),
  reference: string().transform(emptyStringToNull),
})
