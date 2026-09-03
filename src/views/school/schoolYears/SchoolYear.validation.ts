import { z } from 'zod'

export const schoolYearSchema = z.object({
  label: z.string('validation-name-required').min(2).max(120),
  label2: z.string().min(2).max(100),
  periodType: z.object({
    value: z.string(),
    label: z.string().optional(),
  }),
  cycleCount: z.coerce.number(),
  current: z.boolean(),
  id: z.number().optional(),
  ageMin: z.coerce
    .number()
    .nullable()
    .optional()
    .refine((val) => !val || val > 0, { message: 'Must be positive' }),
  ageMax: z.coerce
    .number()
    .nullable()
    .optional()
    .refine((val) => !val || val > 0, { message: 'Must be positive' }),
  startDate: z.any(),
  endDate: z.any(),
})

export type SchoolYearSchemaType = z.input<typeof schoolYearSchema>
