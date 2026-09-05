import { emptyStringToNull } from '@/utils/helpers'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const levelValidation = z.object({
  name: z
    .string()
    .min(2, m.string_min({ min: 2 }))
    .max(120, m.string_max({ max: 120 })),
  cycleId: z.any().refine((val) => val !== null && val !== undefined, {
    message: m.validation_required(),
  }),
  numberOrder: z.coerce.number().min(1),
  branchCount: z
    .string()
    .transform(emptyStringToNull)
    .nullable()
    .optional()
    .transform((val) =>
      val === null || val === undefined ? null : Number(val),
    ),
  note: z
    .string()
    .max(255, m.string_max({ max: 255 }))
    .refine((val) => !val || val.length >= 2, {
      message: m.string_min({ min: 2 }),
    })
    .transform(emptyStringToNull)
    .optional()
    .nullable(),
})

export type LevelSchemaType = z.input<typeof levelValidation>
