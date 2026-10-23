import { z } from 'zod'
import { m } from '@/paraglide/messages'
import { optionalString } from '@/utils/zod.helpers'

const permissionItemSchema = z.object({
  id: z.number(),
  code: z.string(),
  checked: z.boolean(),
})

const permissionGroupSchema = z.object({
  groupName: z.string(),
  checked: z.boolean().optional(),
  items: z.array(permissionItemSchema),
})

export const roleSchema = z.object({
  name: z
    .string(m.validation_required())
    .min(2, m.string_min({ min: 2 }))
    .max(120, m.string_max({ max: 120 })),
  description: optionalString(),
  active: z.boolean(),
  items: z.array(permissionGroupSchema),
})

export type RoleSchemaType = z.input<typeof roleSchema>
