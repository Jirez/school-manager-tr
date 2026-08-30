import { emptyStringToNull } from '@/utils/helpers'
import * as yup from 'yup'

export const accountValidation: yup.ObjectSchema<any> = yup.object({
  name: yup.string().required().min(2).max(150),
  displayName: yup.string().min(2).max(150).transform(emptyStringToNull),
  description: yup
    .string()
    .optional()
    .min(2)
    .max(255)
    .transform(emptyStringToNull),
  number: yup.string().required().min(6).max(15),
  chartOfAccountId: yup.object().required().typeError('Field required'),
})
