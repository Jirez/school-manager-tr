import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, date, boolean } from 'yup'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const installmentValidation = object({
  name: string().required('validation-name-required').min(2).max(60),
  name2: string().required('validation-name-required').min(2).max(60),
  dueDate: date().required().typeError('Field required'),
  numberOrder: number().required(),
  lateFeePercentage: number().required(),
  gracePeriodDays: number().required(),
  isActive: boolean().required(),
  isRefundable: boolean().required(),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
  id: number().optional(),
})

export const installmentZodSchema = z.object({
  name: z
    .string(m.validation_required())
    .min(2, m.string_min({ min: 2 }))
    .max(60, m.string_max({ max: 60 })),
  name2: z
    .string()
    .min(2, m.string_min({ min: 2 }))
    .max(60, m.string_max({ max: 60 })),
  numberOrder: z.coerce.number().min(1, m.validation_required()),
  dueDate: z.array(z.date()).or(z.date()),
  lateFeePercentage: z.coerce.number().min(0),
  gracePeriodDays: z.coerce.number().min(0),
  isActive: z.boolean(),
  isRefundable: z.boolean(),
  note: z.string().transform(emptyStringToNull).optional().nullable(),
})

export type InstallmentZodSchemaType = z.infer<typeof installmentZodSchema>
