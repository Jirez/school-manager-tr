import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import {m} from "@/paraglide/messages"

export const schoolSectionValidation = z.object({
  name: z.string().min(2,m.string_min({min:2})).max(120,m.string_max({max:120})),
  languageId: z.any().refine((val) => val !== null && val !== undefined, {
    message: m.validation_required(),
  }),
  active: z.boolean(),
  note: z
    .string()
    .max(255,m.string_max({max:255}))
    .refine((val) => !val || val.length >= 5, {
      message: m.string_min({min:5}),
    })
    .transform(emptyStringToNull)
    .optional()
    .nullable(),
})

export type SchoolSectionSchemaType = z.input<typeof schoolSectionValidation>
