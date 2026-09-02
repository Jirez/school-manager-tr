import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'

export const subjectSchema = z.object({
  name: z.string('validation-name-required').min(2).max(120),
  displayName: z.string(),
  subjectDepartmentId: z.any(),
  active: z.boolean(),
  showInTimeTable: z.boolean(),
  code: z.string().transform(emptyStringToNull).optional(),
  id: z.number().optional(),
  note: z.string().transform(emptyStringToNull).optional(),
})

export type SubjectSchemaType = z.input<typeof subjectSchema>
