import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const subjectDepartmentSchema = z.object({
  name: z
    .string(m.validation_required())
    .min(2, m.string_min({ min: 2 }))
    .max(50, m.string_max({ max: 50 })),
  schoolSectionId: z.any(),
  active: z.boolean(),
  id: z.number().optional(),
  note: z
    .string()
    .refine((val) => !val || val.length >= 5, {
      message: m.string_min({ min: 5 }),
    })
    .max(255, m.string_max({ max: 255 }))
    .transform(emptyStringToNull)
    .optional()
    .nullable(),
})

export type SubjectDepartmentSchemaType = z.input<
  typeof subjectDepartmentSchema
>
