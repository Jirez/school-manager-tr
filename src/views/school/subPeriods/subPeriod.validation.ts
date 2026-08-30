import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, date } from 'yup'

export const subPeriodValidationSchema = object({
  label: string().required('validation-name-required').min(2).max(50),
  periodId: object().required().typeError('Field required'),
  startDate: date().required().typeError('Field required'),
  endDate: date().required().typeError('Field required'),
  numberOrder: number().required().transform(emptyStringToNull),
  id: number().optional(),
  message: string().optional().transform(emptyStringToNull),
  message2: string().optional().transform(emptyStringToNull),
})
