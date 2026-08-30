import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, boolean } from 'yup'

export const departmentValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(50),
  schoolSectionId: object().required().typeError('Field required'),
  active: boolean().required(),
  id: number().optional(),
  note: string().optional().min(2).max(255).transform(emptyStringToNull),
})
