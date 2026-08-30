import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, date } from 'yup'

export const attendanceValidation = object({
  workDate: date().required('Field required'),
  arrivalTime: string().nullable(),
  departureTime: string().nullable(),
  type: string().required('Field required'),
  status: string().required('Field required'),
  personnelId: object().required(),
  note: string().nullable().min(5).max(255).transform(emptyStringToNull),
  id: number().optional(),
})
