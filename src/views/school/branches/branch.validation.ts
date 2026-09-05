import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number } from 'yup'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const branchValidationSchema = object({
  name: string().required('validation-name-required').min(2).max(50),
  levelId: object().required().typeError('Field required'),
  id: number().optional(),
  maxStudent: number().optional().transform(emptyStringToNull),
  classCount: number().optional().transform(emptyStringToNull),
  subjectCount: number().optional().transform(emptyStringToNull),
})

export const subjectBranchZodSchema = z.object({
  subjectBranchPK: z.object({
    branchId: z.number().optional(),
    subjectId: z.number(),
  }),
  subjectName: z.string().optional(),
  coefficient: z.coerce.number().min(0),
  weeklyHourCount: z.coerce.number().nullable().optional(),
  sessionCount: z.coerce.number().nullable().optional(),
  maxSessionDuration: z.coerce.number().nullable().optional(),
  priority: z.coerce.number().nullable().optional(),
  number: z.coerce.number().nullable().optional(),
  scale: z.coerce.number().nullable().optional(),
})

export const branchZodSchema = z.object({
  name: z
    .string(m.validation_required())
    .min(2, m.string_min({ min: 2 }))
    .max(50, m.string_max({ max: 50 })),
  levelId: z.any().refine((val) => val !== null && val !== undefined, {
    message: m.validation_required(),
  }),
  id: z.number().optional(),
  maxStudent: z.coerce
    .number()
    .transform((val) => val || null)
    .optional()
    .nullable(),
  classCount: z.coerce
    .number()
    .transform((val) => val || null)
    .optional()
    .nullable(),
  subjectCount: z.coerce
    .number()
    .transform((val) => val || null)
    .optional()
    .nullable(),
  totalCoefficient: z.coerce
    .number()
    .transform((val) => val || null)
    .optional()
    .nullable(),
  branchId: z.any().optional(),
  items: z.array(subjectBranchZodSchema).min(0),
})

export type BranchZodSchemaType = z.infer<typeof branchZodSchema>
export type SubjectBranchZodSchemaType = z.infer<typeof subjectBranchZodSchema>
