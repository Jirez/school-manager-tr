import { emptyStringToNull } from '@/utils/helpers'
import { string, object, number, ref } from 'yup'

export const userValidationSchema = object({
  username: string().required('validation-name-required').min(5).max(30),
  personId: object().required(),
  password: string()
    .required()
    .min(8, 'Le mot de passe doit avoir au moins 8 caractères'),
  confirm: string().oneOf(
    [ref('password')],
    'Les mots de passe ne coïncident pas',
  ),
  id: number().optional(),
  email: string().optional().transform(emptyStringToNull),
})

export const userUpdateValidationSchema = object({
  username: string().required('validation-name-required').min(5).max(30),
  //personId: object().required(),
  password: string().optional().transform(emptyStringToNull),
  //.min(8, "Le mot de passe doit avoir au moins 8 caractères"),
  confirm: string()
    .transform(emptyStringToNull)
    .oneOf([ref('password')], 'Les mots de passe ne coïncident pas'),
  id: number().optional(),
  email: string().optional().transform(emptyStringToNull),
})

export const passwordChangeValidationSchema = object({
  originalPassword: string().required(),
  newPassword: string()
    .required()
    .min(8, 'Le mot de passe doit avoir au moins 8 caractères'),
  confirm: string().oneOf(
    [ref('newPassword')],
    'Les mots de passe ne coïncident pas',
  ),
})
