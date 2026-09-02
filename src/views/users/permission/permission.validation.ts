import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'

export const permissionSchema = z.object({
  code: z.string(),
  active: z.boolean(),
  description: z
    .string()
    .refine((val) => !val || val.length >= 5, {
      message: 'String must contain at least 5 character(s)',
    })
    .max(255)
    .transform(emptyStringToNull)
    .optional(),
})

export type PermissionSchemaType = z.input<typeof permissionSchema>
