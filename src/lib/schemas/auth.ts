import { z } from "zod";

export const signUpFormSchema = z
  .object({
    email: z.string().email({
      message: "Email is required.",
    }),
    password: z
      .string()
      .min(6, {
        message: "Password is required and must be at least 6 characters.",
      })
      .max(255),
    password2: z.string(),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords must match.",
    path: ["password2"],
  });

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
