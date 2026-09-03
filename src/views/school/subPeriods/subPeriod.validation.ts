import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const subPeriodValidation = z.object({
  label: z
    .string()
    .min(2, m.string_min({ min: 2 }))
    .max(50, m.string_max({ max: 50 })),
  label2: z
    .string()
    .min(2, m.string_min({ min: 2 }))
    .max(50, m.string_max({ max: 50 }))
    .optional()
    .nullable(),
  periodId: z.any().refine((val) => val !== null && val !== undefined, {
    message: m.validation_required(),
  }),
  startDate: z.array(z.date()).or(z.date()),
  endDate: z.array(z.date()).or(z.date()),
  numberOrder: z.coerce.number().min(1).max(6).positive().int(),
  coefficient: z.coerce.number().optional().nullable(),
  message: z.string().transform(emptyStringToNull).optional().nullable(),
  message2: z.string().transform(emptyStringToNull).optional().nullable(),
})

export type SubPeriodSchemaType = z.input<typeof subPeriodValidation>
