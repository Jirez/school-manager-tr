import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'

export const subjectDepartmentSchema = z.object({
  name: z.string('validation-name-required').min(2).max(50),
  schoolSectionId: z.any(),
  active: z.boolean(),
  id: z.number().optional(),
  note: z
    .string()
    .refine((val) => !val || val.length >= 2, {
      message: 'String must contain at least 5 character(s)',
    })
    .max(255)
    .transform(emptyStringToNull)
    .optional()
    .nullable(),
})

export type SubjectDepartmentSchemaType = z.input<
  typeof subjectDepartmentSchema
>
