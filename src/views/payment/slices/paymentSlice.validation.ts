import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, date } from 'yup'

export const paymentSliceValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(60),
  name2: string().required('validation-name-required').min(2).max(60),
  schoolYearId: object().required(),
  deadline: date().required().typeError('Field required'),
  numberOrder: number().required(),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
  id: number().optional(),
})
