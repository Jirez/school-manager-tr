import { emptyStringToNull } from '@/utils/helpers'
import { string, object, boolean, number } from 'yup'

export const competenceValidation = object({
  name: string().required('validation-name-required').min(2).max(150),
  marks: number().required(),
  numberOrder: number().required(),
  active: boolean().required(),
  levelId: object().required().typeError('Field required'),
  id: number().optional(),
  description: string().optional().transform(emptyStringToNull),
})
