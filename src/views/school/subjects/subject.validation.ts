import { z } from 'zod'
import { m } from '@/paraglide/messages'
import { optionalString, requiredSelect } from '#/utils/zod.helpers'

export const subjectSchema = z.object({
  name: z
    .string(m.validation_required())
    .min(2, m.string_min({ min: 2 }))
    .max(120, m.string_max({ max: 120 })),
  displayName: z.string(),
  subjectDepartmentId: requiredSelect(),
  active: z.boolean(),
  showInTimeTable: z.boolean(),
  code: optionalString(),
  id: z.number().optional(),
  note: optionalString(),
})

export type SubjectSchemaType = z.input<typeof subjectSchema>
