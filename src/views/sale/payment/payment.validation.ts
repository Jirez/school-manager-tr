import { emptyStringToNull } from '@/utils/helpers'
import { ObjectSchema, object, number, date, string } from 'yup'

export const paymentOfStudentValidation: ObjectSchema<any> = object({
  //studentId: number().required(),
  paymentDate: date().required().typeError('Field required'),
  id: number().optional(),
  note: string().nullable().min(5).max(255).transform(emptyStringToNull),
  reference: string().transform(emptyStringToNull),
  paymentAccountId: object().required(),
  //paymentModeId: object().optional(),
})
