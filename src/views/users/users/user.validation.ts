import { emptyStringToNull } from '@/utils/helpers'
import { string, number, ref } from 'yup'
import { z } from 'zod'
import { m } from '@/paraglide/messages'

export const userValidationSchema = z
  .object({
    username: z.string(m.validation_required()).min(5).max(30),
    personId: z.object().required(),
    password: z.string().min(8, m.string_min({ min: 8 })),
    confirm: string().oneOf([ref('password')], m.validation_password_match()),
    id: number().optional(),
    email: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.confirm, {
    message: m.validation_password_match(),
    path: ['confirm'],
  })

export const userUpdateValidationSchema = z
  .object({
    username: z.string().min(5).max(30),
    // personId: object().required(),
    password: z.string().transform(emptyStringToNull).optional(),
    // min(8, "Le mot de passe doit avoir au moins 8 caractères"),
    confirm: z.string().transform(emptyStringToNull),
    id: number().optional(),
    email: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.confirm, {
    message: m.validation_password_match(),
    path: ['confirm'],
  })

export const passwordChangeSchema = z
  .object({
    originalPassword: z
      .string(m.validation_required())
      .min(8, m.string_min({ min: 8 })),
    newPassword: z.string().min(8, m.string_min({ min: 8 })),
    confirm: z.string(),
  })
  .refine((data) => data.newPassword === data.confirm, {
    message: m.validation_password_match(),
    path: ['confirm'],
  })

export type PasswordChangeSchemaType = z.infer<typeof passwordChangeSchema>

export const userCreateSchema = z
  .object({
    username: z
      .string(m.validation_required())
      .min(5, m.string_min({ min: 5 }))
      .max(30, m.string_max({ max: 30 })),
    email: z.string().transform(emptyStringToNull).optional().nullable(),
    password: z
      .string(m.validation_required())
      .min(8, m.string_min({ min: 8 })),
    confirm: z.string(),
    personId: z.object({ id: z.any() }, m.validation_required()),
    isEnabled: z.boolean(),
    mfa: z.boolean(),
    roles: z.array(z.any()).nullable(),
  })
  .refine((data) => data.password === data.confirm, {
    message: m.validation_password_match(),
    path: ['confirm'],
  })

export const userUpdateSchema = z
  .object({
    username: z
      .string(m.validation_required())
      .min(5, m.string_min({ min: 5 }))
      .max(30, m.string_max({ max: 30 })),
    email: z.string().transform(emptyStringToNull).optional().nullable(),
    password: z.string().transform(emptyStringToNull).optional().nullable(),
    confirm: z.string().transform(emptyStringToNull).optional().nullable(),
    personId: z.object({ id: z.any() }).nullable().optional(),
    isEnabled: z.boolean(),
    mfa: z.boolean(),
    roles: z.array(z.any()).nullable(),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.confirm
      }
      return true
    },
    {
      message: m.validation_password_match(),
      path: ['confirm'],
    },
  )

export type UserCreateSchemaType = z.infer<typeof userCreateSchema>
export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>
