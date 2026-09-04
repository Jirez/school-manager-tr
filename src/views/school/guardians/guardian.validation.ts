import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number } from 'yup'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const guardianValidationSchema = object({
  lastName: string().required('validation-name-required').min(2).max(120),
  firstName: string().optional().min(2).max(60).transform(emptyStringToNull),
  languageId: object().required().typeError('Field required'),
  gender: object().required().typeError('Field required'),
  id: number().optional(),
  profession: string().optional().min(2).max(60).transform(emptyStringToNull),
  job: string().optional().min(2).max(60).transform(emptyStringToNull),
  religion: string().optional().min(2).max(50).transform(emptyStringToNull),
  regionOrigin: string().optional().min(2).max(50).transform(emptyStringToNull),
  departmentOrigin: string()
    .optional()
    .min(2)
    .max(50)
    .transform(emptyStringToNull),
  districtOrigin: string()
    .optional()
    .min(2)
    .max(50)
    .transform(emptyStringToNull),
  contactInfo: object({
    telephone: string().optional().min(9).max(64).transform(emptyStringToNull),
    fax: string().optional().min(9).max(64).transform(emptyStringToNull),
    mobile: string().optional().min(9).max(64).transform(emptyStringToNull),
    email: string().optional().min(6).max(60).transform(emptyStringToNull),
    postOfficeBox: string()
      .optional()
      .min(2)
      .max(64)
      .transform(emptyStringToNull),
  }),
  address: object({
    town: string().optional().min(2).max(50).transform(emptyStringToNull),
    state: string().optional().min(2).max(50).transform(emptyStringToNull),
    street: string().optional().min(2).max(50).transform(emptyStringToNull),
    country: string().optional().min(2).max(50).transform(emptyStringToNull),
    zipCode: string().optional().min(3).max(5).transform(emptyStringToNull),
  }),
})

export const guardianZodSchema = z.object({
  lastName: z
    .string(m.validation_required())
    .min(2, m.string_min({ min: 2 }))
    .max(120, m.string_max({ max: 120 })),
  firstName: z.string().optional().or(z.literal('')),
  languageId: z.object({ id: z.any() }).nullable(),
  gender: z.any(),
  profession: z.string().transform(emptyStringToNull).optional(),
  job: z.string().transform(emptyStringToNull).optional(),
  religion: z.string().transform(emptyStringToNull).optional(),
  regionOrigin: z.string().transform(emptyStringToNull).optional(),
  departmentOrigin: z.string().transform(emptyStringToNull).optional(),
  districtOrigin: z.string().transform(emptyStringToNull).optional(),
  note: z.string().optional(),
  active: z.boolean(),
  contactInfo: z
    .object({
      telephone: z.string().optional(),
      fax: z.string().transform(emptyStringToNull).optional(),
      mobile: z.string().transform(emptyStringToNull).optional(),
      email: z.string().transform(emptyStringToNull).optional(),
      postOfficeBox: z.string().optional(),
    })
    .nullable(),
  address: z
    .object({
      town: z.string().transform(emptyStringToNull).optional(),
      state: z.string().transform(emptyStringToNull).optional(),
      street: z.string().transform(emptyStringToNull).optional(),
      country: z.string().transform(emptyStringToNull).optional(),
      zipCode: z.string().transform(emptyStringToNull).optional(),
    })
    .nullable(),
  language: z.any().optional(),
  id: z.number().optional(),
})

export type GuardianZodSchemaType = z.input<typeof guardianZodSchema>
