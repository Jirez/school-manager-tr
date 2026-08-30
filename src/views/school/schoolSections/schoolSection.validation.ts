import { emptyStringToNull } from '@/utils/helpers'
import { string, object, boolean, number } from 'yup'

export const schoolSectionValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(120),
  languageId: object().required().typeError('Field required'),
  active: boolean().required(),
  id: number().optional(),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
})
