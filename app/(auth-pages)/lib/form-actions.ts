"use server";


import { signUpFormSchema, LoginSchema } from "./form-schema";
import { z } from "zod";
import { signIn, signOut } from "../auth";
import { AuthError } from "next-auth";
import { CreateNewUser, getUserByEmail } from "@/app/lib/users";
import { FormState } from "@/app/components/auth/auth-form";
import { checkRateLimit } from "@/app/lib/security/rate-limiter";
import { logSecurityEvent } from "@/app/lib/security/audit-logger";

export async function handleLoginUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const emailInput = typeof formData.get("email") === "string" ? String(formData.get("email")).trim().toLowerCase() : "";
  const rateLimit = checkRateLimit(`login:${emailInput || "anonymous"}`, 10, 5 * 60 * 1000);
  if (!rateLimit.success) {
    return {
      success: false,
      errors: {
        general: "Too many login attempts. Please wait a few minutes before trying again.",
      },
    };
  }

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

    logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "AUTH_LOGIN_SUCCESS",
      details: { emailDomain: validatedUserData.email.split("@")[1] || "unknown" },
    });

    return { success: true };
  } catch (err) {
    console.error("Login action error:", err instanceof Error ? err.message : "Authentication failed");
    logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "AUTH_LOGIN_FAILED",
      details: { emailDomain: emailInput.split("@")[1] || "unknown" },
    });

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
  const emailInput = typeof formData.get("email") === "string" ? String(formData.get("email")).trim().toLowerCase() : "";
  const rateLimit = checkRateLimit(`signup:${emailInput || "anonymous"}`, 5, 5 * 60 * 1000);
  if (!rateLimit.success) {
    return {
      success: false,
      errors: {
        general: "Too many registration attempts. Please wait a few minutes before trying again.",
      },
    };
  }

  try {
    const userData = {
      fullname: formData.get("fullname"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmpassword: formData.get("confirmpassword"),
      termsConsent: formData.get("termsConsent"),
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

    const newUser = await CreateNewUser({
      email: validatedUserData.email,
      fullname: validatedUserData.fullname,
      password: validatedUserData.password,
    });

    logSecurityEvent({
      timestamp: new Date().toISOString(),
      action: "AUTH_SIGNUP_SUCCESS",
      actorUserId: newUser.id,
      details: { emailDomain: validatedUserData.email.split("@")[1] || "unknown" },
    });

    return { success: true };
  } catch (err) {
    console.error("Signup action error:", err instanceof Error ? err.message : "Registration failed");
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
