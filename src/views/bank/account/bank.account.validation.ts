import { string, object, number, date } from 'yup'

export const bankAccountValidation = object({
  name: string().required().min(2).max(100),
  number: string().required().min(4).max(20),
  id: number().optional(),
  type: string().required(),
  status: string().required(),
  interestRate: number()
    .nullable()
    .transform((v) => (v === '' || isNaN(v) ? null : v)),
  overdraftLimit: number()
    .nullable()
    .transform((v) => (v === '' || isNaN(v) ? null : v)),
  openingBalance: number()
    .nullable()
    .transform((v) => (v === '' || isNaN(v) ? null : v)),
  openedDate: date()
    .nullable()
    .transform((v) => (v === '' || isNaN(v) ? null : v)),
  closedDate: date()
    .nullable()
    .transform((v) => (v === '' || isNaN(v) ? null : v)),
  accountId: object().required(),
})
