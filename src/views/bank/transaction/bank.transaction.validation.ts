import { string, object, number, date } from 'yup'

export const bankTransactionValidation = object({
  type: string().required(),
  status: string().required(),
  referenceNumber: string().nullable(),
  transactionDate: date()
    .required()
    .transform((v) => (v === '' || isNaN(v) ? null : v)),
  amount: number()
    .required()
    .transform((v) => (v === '' || isNaN(v) ? null : v)),
  description: string()
    .nullable()
    .transform((v) => (v === '' || isNaN(v) ? null : v)),
  bankAccountId: object().required(),
  accountId: object().required(),
})
