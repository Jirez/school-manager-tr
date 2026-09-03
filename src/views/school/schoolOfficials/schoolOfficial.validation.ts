import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import {m} from "@/paraglide/messages"

export const schoolOfficialValidation = z.object({
  name: z.string().min(2,m.string_min({min:2})).max(50,m.string_max({max:50})),
  liableTypeId: z.any().refine((val) => val !== null && val !== undefined, {
    message: m.validation_required(),
  }),
  email: z.string()
    .max(255,m.string_max({max:255}))
    .refine((val) => !val || val.length >= 5, {
      message: m.string_min({min:5}),
    })
    .transform(emptyStringToNull)
    .optional()
    .nullable(),
  signature: z.string().nullable().optional(),
})

export type SchoolOfficialSchemaType = z.input<typeof schoolOfficialValidation>
