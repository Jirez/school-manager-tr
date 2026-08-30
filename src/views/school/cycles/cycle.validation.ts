import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number } from 'yup'

export const cycleValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(30),
  schoolYearId: object().required().typeError('Field required'),
  schoolSectionId: object().required().typeError('Field required'),
  numberOrder: number().required(),
  levelCount: number().optional().transform(emptyStringToNull),
  name2: string().optional().min(2).max(30).transform(emptyStringToNull),
  id: number().optional(),
})
