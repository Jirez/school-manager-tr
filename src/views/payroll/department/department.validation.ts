import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'

export const departmentValidation = z.object({
  name: z.string('validation-name-required').min(2).max(50),
  manager: z.string().nullable(),
  active: z.boolean(),
  note: z
    .string()
    .max(255)
    .refine((val) => !val || val.length >= 5, {
      message: 'String must contain at least 5 character(s)',
    })
    .transform(emptyStringToNull)
    .optional()
    .nullable(),
})

export type DepartmentSchemaType = z.input<typeof departmentValidation>
