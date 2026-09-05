import * as z from 'zod'
import { m } from '@/paraglide/messages'

export const optionalString = () =>
  z
    .string()
    .transform((v) => v || null)
    .optional()
    .nullable()

export const requiredSelect = () =>
  z.any().refine((val) => val !== null && val !== undefined, {
    message: m.validation_required(),
  })
