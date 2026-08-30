import { emptyStringToNull } from "@/utils/helpers";
import { string, object, number } from "yup";

export const schoolValidationSchema = object({
  name: string().required("validation-name-required").min(2).max(255),
  motto: string().required().min(2).max(100),
  motto2: string().required().min(2).max(100),
  schoolCode: string().required().min(2).max(10),
  id: number().optional(),
  registrationNumber: string().optional().transform(emptyStringToNull),
  webSite: string().optional().transform(emptyStringToNull),
  shortName: string().optional().transform(emptyStringToNull),
  note: string().optional().min(5).max(255).transform(emptyStringToNull),
  legalInfo: object({
    tradeRegister: string()
      .optional()
      .min(2)
      .max(20)
      .transform(emptyStringToNull),
    taxPayerNumber: string()
      .optional()
      .min(2)
      .max(20)
      .transform(emptyStringToNull),
    legalForm: string().optional().min(2).max(30).transform(emptyStringToNull),
  }),
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
    town: string().required().min(2).max(50).transform(emptyStringToNull),
    street: string().optional().min(2).max(50).transform(emptyStringToNull),
    country: string().optional().min(2).max(50).transform(emptyStringToNull),
    zipCode: string().optional().min(3).max(5).transform(emptyStringToNull),
    state: string().optional().min(2).max(50).transform(emptyStringToNull),
  }),
});
