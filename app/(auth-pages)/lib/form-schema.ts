import { z } from "zod";

export const signUpFormSchema = z.object({
    fullname: z
      .string()
      .trim()
      .min(5, { message: "Must be 5 or more characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .trim()
      .min(8, { message: "Must be at least 8 characters" }),
    confirmpassword: z
      .string()
      .trim()
      .min(8, { message: "Must be at least 8 characters" }),
    termsConsent: z.preprocess(
      (val) => val === "on" || val === true || val === "true",
      z.literal(true, {
        errorMap: () => ({ message: "You must acknowledge the Terms & Conditions and Privacy Policy to create an account." }),
      })
    ),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Must be at least 8 characters" }),
});

