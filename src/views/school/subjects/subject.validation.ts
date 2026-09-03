import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const subjectSchema = z.object({
  name: z
    .string(m.validation_required())
    .min(2, m.string_min({ min: 2 }))
    .max(120, m.string_max({ max: 120 })),
  displayName: z.string(),
  subjectDepartmentId: z.any(),
  active: z.boolean(),
  showInTimeTable: z.boolean(),
  code: z.string().transform(emptyStringToNull).optional(),
  id: z.number().optional(),
  note: z.string().transform(emptyStringToNull).optional(),
})

export type SubjectSchemaType = z.input<typeof subjectSchema>
