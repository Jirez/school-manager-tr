import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const schoolYearSchema = z.object({
  label: z
    .string(m.validation_required())
    .min(2, m.string_min({ min: 2 }))
    .max(120, m.string_max({ max: 120 })),
  label2: z
    .string()
    .min(2, m.string_min({ min: 2 }))
    .max(100, m.string_max({ max: 100 })),
  periodType: z.object(
    {
      value: z.string(),
      label: z.string().optional(),
    },
    m.validation_required(),
  ),
  cycleCount: z.coerce
    .number(m.validation_required())
    .min(1, m.number_min({ min: 1 })),
  current: z.boolean(),
  id: z.number().optional(),
  ageMin: z.coerce
    .number()
    .transform((v) => (Number.isNaN(v) ? null : v))
    .nullable()
    .optional(),
  //.refine((val) => !val || val > 0, { message: 'Must be positive' }),
  ageMax: z.coerce
    .number()
    .nullable()
    .optional()
    .refine((val) => !val || val > 0, { message: 'Must be positive' }),
  startDate: z.any(),
  endDate: z.any(),
})

export type SchoolYearSchemaType = z.input<typeof schoolYearSchema>
