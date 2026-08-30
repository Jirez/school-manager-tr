import { emptyStringToNull } from '@/utils/helpers'
import { string, object, boolean, number } from 'yup'

export const validationSchema = object({
  name: string().required('validation-name-required').min(2).max(120),
  displayName: string().required(),
  subjectDepartmentId: object().required(),
  active: boolean().required(),
  showInTimeTable: boolean().required(),
  code: string().optional().transform(emptyStringToNull),
  id: number().optional(),
  note: string().optional().transform(emptyStringToNull),
})
