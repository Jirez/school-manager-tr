import { object, number, date, string } from 'yup'

export const payrollPeriodValidationSchema = object({
  startDate: date().required(),
  endDate: date().required(),
  paymentDate: date().required(),
  type: string().required(),
  status: string().required(),
  id: number().optional(),
})
