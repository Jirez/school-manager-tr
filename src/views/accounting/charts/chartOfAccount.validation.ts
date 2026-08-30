import { emptyStringToNull } from '@/utils/helpers'
import * as yup from 'yup'

export const chartOfAccountValidation: yup.ObjectSchema<any> = yup.object({
  id: yup.number().required(),
  accountCategoryId: yup.object().required().typeError('Field required'),
  accountGroupId: yup.object().required().typeError('Field required'),
  number: yup.string().required(),
  name: yup.string().required(),
  note: yup.string().optional().min(5).max(255).transform(emptyStringToNull),
})
