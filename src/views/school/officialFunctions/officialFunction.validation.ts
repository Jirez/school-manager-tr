import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const officialFunctionValidation = z.object({
  name: z
    .string()
    .min(2, m.string_min({ min: 2 }))
    .max(60, m.string_max({ max: 60 })),
  prefix: z
    .string()
    .min(2, m.string_min({ min: 2 }))
    .max(5, m.string_max({ max: 5 })),
  active: z.boolean(),
  note: z
    .string()
    .transform(emptyStringToNull)
    .pipe(
      z
        .string()
        .min(2, m.string_min({ min: 2 }))
        .max(255, m.string_max({ max: 255 }))
        .optional(),
    ),
})

export type OfficialFunctionSchemaType = z.input<
  typeof officialFunctionValidation
>
