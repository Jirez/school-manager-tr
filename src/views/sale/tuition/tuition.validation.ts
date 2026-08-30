import { emptyStringToNull } from '@/utils/helpers'
import * as yup from 'yup'

export const tuitionValidation = yup.object({
  name: yup.string().required().min(2).max(120),
  sku: yup.string().min(2).max(15).transform(emptyStringToNull),
  saleDescription: yup
    .string()
    .optional()
    .min(2)
    .max(255)
    .transform(emptyStringToNull),
  purchasePrice: yup.number().optional().transform(emptyStringToNull),
  productCategoryId: yup.object().required().typeError('Field required'),
  saleAccountId: yup.object().required().typeError('Field required'),
  purchaseAccountId: yup.object().required().typeError('Field required'),
  salePrice: yup.number().optional().transform(emptyStringToNull),
  cost: yup.number().optional().transform(emptyStringToNull),
  name2: yup.string().optional().transform(emptyStringToNull),
  isMandatory: yup.boolean().required(),
  isCollected: yup.boolean().required(),
  allowPaymentInKind: yup.boolean().required(),
  numberOrder: yup.number().required().typeError('Field required'),
})
