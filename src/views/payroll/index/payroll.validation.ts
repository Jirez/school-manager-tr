import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, date } from 'yup'

export const payrollValidation = object({
  baseSalary: number().required().min(0),
  id: number().nullable(),
  note: string().nullable().min(2).max(255).transform(emptyStringToNull),
  operationDate: date().required().typeError('Field required'),
  periodId: object().required().typeError('Field required'),
  paymentModeId: object().required().typeError('Field required'),
  employeeId: object().required().typeError('Field required'),
})
