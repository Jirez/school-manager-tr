import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import {m} from "@/paraglide/messages"

export const cycleSchema = z.object({
  name: z.string(m.validation_required())
    .min(2, m.string_min({ min: 2 })).max(30, m.string_max({ max: 30 })),
  schoolYearId: z.any(),
  schoolSectionId: z.any(),
  numberOrder: z.coerce.number(),
  levelCount: z.coerce.number().optional().nullable(),
  name2: z
    .string()
    .min(2, m.string_min({ min: 2 })).max(30, m.string_max({ max: 30 }))
    .transform(emptyStringToNull)
    .optional()
    .nullable(),
  id: z.number().optional(),
})

export type CycleSchemaType = z.input<typeof cycleSchema>
