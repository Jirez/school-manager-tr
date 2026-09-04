import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const permissionSchema = z.object({
  code: z.string(),
  active: z.boolean(),
  description: z
    .string()
    .refine((val) => !val || val.length >= 5, {
      message: m.string_min({ min: 5 }),
    })
    .max(255, m.string_max({ max: 255 }))
    .transform(emptyStringToNull)
    .optional(),
})

export type PermissionSchemaType = z.input<typeof permissionSchema>
