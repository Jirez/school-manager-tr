import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, date } from 'yup'

export const periodValidationSchema = object({
  label: string().required('validation-name-required').min(2).max(50),
  schoolYearId: object().required().typeError('Field required'),
  startDate: date().required().typeError('Field required'),
  endDate: date().required().typeError('Field required'),
  numberOrder: number().required().transform(emptyStringToNull),
  coefficient: number().required(),
  id: number().optional(),
  message: string().optional().transform(emptyStringToNull),
  message2: string().optional().transform(emptyStringToNull),
})
