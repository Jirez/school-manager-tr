import { string, object, number } from 'yup'
import { emptyStringToNull } from '@/utils/helpers'

export const paymentModeValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(60),
  description: string().optional().min(2).max(255).transform(emptyStringToNull),
  id: number().optional(),
})
