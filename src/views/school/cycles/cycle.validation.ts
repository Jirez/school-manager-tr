import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'

export const cycleSchema = z.object({
  name: z.string('validation-name-required').min(2).max(30),
  schoolYearId: z.any(),
  schoolSectionId: z.any(),
  numberOrder: z.number(),
  levelCount: z.coerce.number().optional().nullable(),
  name2: z
    .string()
    .min(2)
    .max(30)
    .transform(emptyStringToNull)
    .optional()
    .nullable(),
  id: z.number().optional(),
})

export type CycleSchemaType = z.input<typeof cycleSchema>
