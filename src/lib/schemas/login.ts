import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password is required.",
    })
    .max(255),
});
