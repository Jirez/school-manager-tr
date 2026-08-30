import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number } from 'yup'

export const paymentGroupValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(60),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
  schoolYearId: object().required().typeError('Field required'),
  id: number().optional(),
})
