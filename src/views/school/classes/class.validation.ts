import { z } from 'zod'
import {m} from "@/paraglide/messages"

export const classValidation = z.object({
  name: z.string().min(2, m.string_min({min: 2})).max(120, m.string_max({max: 120})),
  branchId: z.any().refine((val) => val !== null && val !== undefined, {
    message: m.validation_required(),
  }),
  headTeacherId: z.any().nullable().optional(),
  code: z.string().optional(),
  examClass: z.boolean(),
  autoTimeTable: z.boolean(),
  competenceClass: z.boolean(),
})

export type ClassSchemaType = z.input<typeof classValidation>
