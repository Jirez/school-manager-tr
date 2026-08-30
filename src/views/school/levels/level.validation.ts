import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number } from 'yup'

export const levelValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(120),
  cycleId: object().required().typeError('Field required'),
  numberOrder: number().required(),
  branchCount: number().optional().transform(emptyStringToNull),
  note: string().optional().min(2).max(255).transform(emptyStringToNull),
  id: number().optional(),
})
