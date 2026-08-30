import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, date, boolean } from 'yup'

export const installmentValidation = object({
  name: string().required('validation-name-required').min(2).max(60),
  name2: string().required('validation-name-required').min(2).max(60),
  dueDate: date().required().typeError('Field required'),
  numberOrder: number().required(),
  lateFeePercentage: number().required(),
  gracePeriodDays: number().required(),
  isActive: boolean().required(),
  isRefundable: boolean().required(),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
  id: number().optional(),
})
