import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import {m} from "@/paraglide/messages"

export const languageValidation = z.object({
  name: z.string(m.validation_required()).min(2,m.string_min({min:2})).max(20,m.string_max({max:20})),
  code: z.object({value: z.enum(['EN', 'FR']),label: z.string()},m.validation_required()),
  active: z.boolean(),
  description: z
    .string()
    .max(255,m.string_max({max:255}))
    .refine((val) => !val || val.length >= 5, {
      message: m.string_min({min:5}),
    })
    .transform(emptyStringToNull)
    .optional()
    .nullable(),
})

export type LanguageSchemaType = z.input<typeof languageValidation>
