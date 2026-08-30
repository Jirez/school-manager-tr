import { string, object, number, boolean } from "yup";

export const timeSlotValidation = object({
  name: string().required().max(50),
  startTime: string().required().typeError("Field required"),
  endTime: string().required().typeError("Field required"),
  isBreakTime: boolean().required(),
  isActive: boolean().required(),
  id: number().nullable(),
});
