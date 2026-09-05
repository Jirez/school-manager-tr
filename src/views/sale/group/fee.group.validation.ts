import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, boolean, date } from 'yup'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const feeGroupValidation = object({
  name: string().required('validation-name-required').min(2).max(50),
  name2: string().nullable().min(2).max(50),
  registrationDateAfter: date().nullable(),
  registrationDateBefore: date().nullable(),
  birthDateAfter: date().nullable(),
  birthDateBefore: date().nullable(),
  gender: string().nullable(),
  // levelId: number().optional(),
  familyOfXAndAboveChildren: number()
    .nullable()
    .optional()
    .transform(emptyStringToNull),
  oneTimePayment: boolean().required(),
  isAlumni: boolean().required(),
  isExternalStudent: boolean().required(),
  hasScholarship: boolean().required(),
  isSocialCase: boolean().required(),
  isStaffStudent: boolean().required(),
  useAsFallback: boolean().required(),
  isActive: boolean().required(),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
  id: number().optional(),
})

export const feeGroupZodSchema = z.object({
  name: z
    .string(m.validation_required())
    .min(2, m.string_min({ min: 2 }))
    .max(50, m.string_max({ max: 50 })),
  name2: z
    .string()
    .min(2, m.string_min({ min: 2 }))
    .max(50, m.string_max({ max: 50 })),
  registrationDateAfter: z.any().nullable(),
  registrationDateBefore: z.any().nullable(),
  birthDateAfter: z.any().nullable(),
  birthDateBefore: z.any().nullable(),
  gender: z.string().nullable(),
  levelId: z.any().nullable(),
  familyOfXAndAboveChildren: z
    .string()
    .transform(emptyStringToNull)
    .nullable()
    .optional(),
  oneTimePayment: z.boolean(),
  isAlumni: z.boolean(),
  isExternalStudent: z.boolean(),
  hasScholarship: z.boolean(),
  isSocialCase: z.boolean(),
  isStaffStudent: z.boolean(),
  useAsFallback: z.boolean(),
  isActive: z.boolean(),
  note: z.string().transform(emptyStringToNull).optional(),
})

export type FeeGroupZodSchemaType = z.infer<typeof feeGroupZodSchema>
