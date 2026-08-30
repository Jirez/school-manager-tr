import { object, string, number } from "yup";

export const mobilePaymentValidation = object({
  amount: number()
    .required("Le montant est obligatoire")
    .min(100, "Le montant doit être supérieur à 100")
    .transform((val) => (val ? Number(val) : null)),
  phone: string()
    .transform((val) => (val ? val.replace(/\D/g, "") : ""))
    .min(9, "Le numéro de téléphone doit contenir au moins 9 caractères")
    .required("Le numéro de téléphone est obligatoire"),
  registrationNumber: string().required(
    "Le matricule de l'élève est obligatoire"
  ),
});
