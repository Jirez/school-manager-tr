import { string, object, number, boolean } from 'yup'
import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const productCategoryValidation = object({
  name: string().required('validation-name-required').min(2).max(60),
  active: boolean().required(),
  description: string().optional().min(2).max(255).transform(emptyStringToNull),
  id: number().optional(),
})

export const productCategoryZodSchema = z.object({
  name: z
    .string(m.validation_required())
    .min(2, m.string_min({ min: 2 }))
    .max(60, m.string_max({ max: 60 })),
  description: z.string().transform(emptyStringToNull).optional(),
  active: z.boolean(),
  parentId: z.any().nullable(),
})

export type ProductCategoryZodSchemaType = z.input<
  typeof productCategoryZodSchema
>
