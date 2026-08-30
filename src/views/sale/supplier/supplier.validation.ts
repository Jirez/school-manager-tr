import { string, object, number, boolean } from 'yup'
import { emptyStringToNull } from '@/utils/helpers'

export const supplierValidation = object({
  lastName: string().required().min(2).max(120),
  firstName: string().optional().max(120),
  displayName: string().optional().max(120),
  active: boolean().required(),
  note: string().optional().max(255).transform(emptyStringToNull),
  id: number().optional(),
  supplierAccountId: object().required(),
  address: object({
    town: string().optional().min(2).max(50).transform(emptyStringToNull),
    street: string().optional().min(2).max(50).transform(emptyStringToNull),
    country: string().optional().min(2).max(50).transform(emptyStringToNull),
    zipCode: string().optional().min(3).max(5).transform(emptyStringToNull),
    state: string().optional().min(2).max(50).transform(emptyStringToNull),
  }),
  contactInfo: object({
    telephone: string().optional().min(9).max(64).transform(emptyStringToNull),
    telephone2: string().optional().min(9).max(64).transform(emptyStringToNull),
    skype: string().optional().min(5).max(64).transform(emptyStringToNull),
    fax: string().optional().min(9).max(64).transform(emptyStringToNull),
    mobile: string().optional().min(9).max(64).transform(emptyStringToNull),
    email: string().optional().min(6).max(60).transform(emptyStringToNull),
    postOfficeBox: string()
      .optional()
      .min(2)
      .max(64)
      .transform(emptyStringToNull),
  }),
  //openingBalance: number().nullable().transform(v => (v === '' || isNaN(v)) ? null : v),
  //vendorType: string().required().typeError("Field required"),
  tradeRegister: string()
    .optional()
    .min(2)
    .max(20)
    .transform(emptyStringToNull),
  taxNumber: string().optional().min(2).max(20).transform(emptyStringToNull),
  webSite: string().optional().min(5).max(50).transform(emptyStringToNull),
})
