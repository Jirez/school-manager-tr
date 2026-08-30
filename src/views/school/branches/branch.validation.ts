import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number } from 'yup'

export const branchValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(50),
  levelId: object().required().typeError('Field required'),
  id: number().optional(),
  maxStudent: number().optional().transform(emptyStringToNull),
  classCount: number().optional().transform(emptyStringToNull),
  subjectCount: number().optional().transform(emptyStringToNull),
})
