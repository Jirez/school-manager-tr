import { string, object, number } from 'yup'

export const classValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(120),
  branchId: object().required().typeError('Field required'),
  headTeacherId: object().nullable().typeError('Invalid field'),
  code: string().optional(),
  id: number().optional(),
})
