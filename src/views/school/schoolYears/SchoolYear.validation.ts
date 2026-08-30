import { string, object, boolean, number } from "yup";

export const validationSchema = object({
  label: string().required("validation-name-required").min(2).max(120),
  periodType: object({
    value: string().required(),
    label: string(),
  }),
  cycleCount: number().required(),
  current: boolean().required(),
  id: number().optional(),
});
