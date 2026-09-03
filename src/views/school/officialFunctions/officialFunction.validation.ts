import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import {m} from "@/paraglide/messages"

export const officialFunctionValidation = z.object({
  name: z.string().min(2,m.string_min({min:2})).max(60,m.string_max({max:60})),
  prefix: z.string().min(2,m.string_min({min:2})).max(5,m.string_max({max:5})),
  active: z.boolean(),
  note: z
    .string()
    .max(255,m.string_max({max:255}))
    .refine((val) => !val || val.length >= 2, {
      message: m.string_min({min:2}),
    })
    .transform(emptyStringToNull)
    .optional()
    .nullable(),
})

export type OfficialFunctionSchemaType = z.input<typeof officialFunctionValidation>
