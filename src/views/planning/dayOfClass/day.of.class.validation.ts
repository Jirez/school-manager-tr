import * as yup from "yup";

export const dayOfClassValidation = yup.object({
  dayOfWeek: yup.string().required(),
  active: yup.boolean().required(),
  openingTimeId: yup.object().required().typeError("Field required"),
  closingTimeId: yup.object().required().typeError("Field required"),
});
