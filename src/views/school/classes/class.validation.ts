import { z } from 'zod'
import { m } from '@/paraglide/messages'
import { optionalString, requiredSelect } from '#/utils/zod.helpers'

export const classValidation = z.object({
  name: z
    .string()
    .min(2, m.string_min({ min: 2 }))
    .max(120, m.string_max({ max: 120 })),
  branchId: requiredSelect(),
  headTeacherId: z.any().nullable().optional(),
  code: optionalString(),
  examClass: z.boolean(),
  autoTimeTable: z.boolean(),
  competenceClass: z.boolean(),
})

export type ClassSchemaType = z.input<typeof classValidation>
