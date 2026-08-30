import { string, object, ref } from "yup";
import type {ObjectSchema} from "yup"
import type { InitSchoolType } from "./init.school.type";

export const initSchoolValidation: ObjectSchema<InitSchoolType> = object({
  schoolName: string().required().min(2),
  administratorName: string().required().min(2),
  administratorNumber: string().required().min(4).max(10),
  username: string().required().min(5),
  schoolCategory: string().required(),
  password: string()
    .required()
    .min(8, "Le mot de passe doit avoir au moins 8 caractères"),
  confirm: string()
    .required()
    .oneOf([ref("password")], "Les mots de passe ne coïncident pas"),
}) as any;
