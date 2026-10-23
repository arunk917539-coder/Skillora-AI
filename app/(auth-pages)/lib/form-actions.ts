"use server";


import { signUpFormSchema, LoginSchema } from "./form-schema";
import { z } from "zod";
import { signIn, signOut } from "../auth";
import { AuthError } from "next-auth";
import { CreateNewUser, getUserByEmail } from "@/app/lib/users";
import { FormState } from "@/app/components/auth/auth-form";

export async function handleLoginUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const validatedUserData = await LoginSchema.parseAsync({
      email: typeof userData.email === "string" ? userData.email.trim().toLowerCase() : userData.email,
      password: userData.password,
    });

    await signIn("credentials", {
      ...validatedUserData,
      redirect: false,
      redirectTo: "/dashboard",
    });

    return { success: true };
  } catch (err) {
    console.error("Login action error:", err);
    if (err instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      Object.entries(err.flatten().fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          fieldErrors[field] = messages[0];
        }
      });
      return {
        success: false,
        errors: fieldErrors,
      };
    } else if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
        default:
          return {
            success: false,
            errors: {
              general: "Invalid credentials, please try again",
            },
          };
      }
    }
  }
  return {
    success: false,
    errors: {
      general: "Something went wrong",
    },
  };
}

export async function handleSignUpUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const userData = {
      fullname: formData.get("fullname"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmpassword: formData.get("confirmpassword"),
    };

    const validatedUserData = await signUpFormSchema.parseAsync({
      ...userData,
      email: typeof userData.email === "string" ? userData.email.trim().toLowerCase() : userData.email,
    });
    const userExists = await getUserByEmail(validatedUserData.email);

    if (userExists)
      return {
        success: false,
        errors: {
          general: "Email already registered. Please log in.",
        },
      };

    await CreateNewUser(validatedUserData);

    return { success: true };
  } catch (err) {
    console.error("Signup action error:", err);
    if (err instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};

      Object.entries(err.flatten().fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          fieldErrors[field] = messages[0];
        }
      });

      return {
        success: false,
        errors: fieldErrors,
      };
    }

    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        errors: {
          general: "Email already registered. Please log in.",
        },
      };
    }

    return {
      success: false,
      errors: {
        general: "Something went wrong",
      },
    };
  }
}
