import { string, object, number, boolean } from 'yup'
import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import { m } from '@/paraglide/messages'
import { optionalString } from '#/utils/zod.helpers'

export const supplierCategoryValidation = object({
  name: string().required('validation-name-required').min(2).max(120),
  active: boolean().required(),
  description: string()
    .optional()
    .min(2)
    .max(2500)
    .transform(emptyStringToNull),
  id: number().optional(),
  parentId: object().nullable().optional(),
})

export const supplierCategoryZodSchema = z.object({
  name: z
    .string(m.validation_required())
    .min(2, m.string_min({ min: 2 }))
    .max(120, m.string_max({ max: 120 })),
  active: z.boolean(),
  description: optionalString(),
  parentId: z.any().nullable(),
})

export type SupplierCategoryZodSchemaType = z.infer<
  typeof supplierCategoryZodSchema
>
