"use client";

import React, { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleLoginUser, handleSignUpUser } from "@/app/(auth-pages)/lib/form-actions";
import { Input } from "../ui/input";

interface FormItem {
  name: string;
  type: string;
  placeHolder: string;
}

interface AuthFormProps {
  type: "LOGIN" | "SIGNUP";
  formItems: FormItem[];
}

export type FormState = {
  success: boolean;
  errors?: Record<string, string>;
};

const initialFormState: FormState = {
  success: false,
  errors: {},
};

const AuthForm = (props: AuthFormProps) => {
  const router = useRouter();

  const actionFn = props.type === "LOGIN" ? handleLoginUser : handleSignUpUser;
  const [state, formAction, pending] = useActionState(actionFn, initialFormState);

  useEffect(() => {
    // Registration leaves success message visible so user can sign in.
    if (state.success && props.type === "LOGIN") {
      router.push("/dashboard");
    }
  }, [state.success, props.type, router]);

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-4">
        {props.formItems.map((item, index) => {
          const fieldId = item.name.replaceAll(" ", "").toLowerCase();
          const errorMsg = state.errors && state.errors[fieldId];
          return (
            <div key={index} className="flex flex-col gap-1.5">
              <label htmlFor={fieldId} className="text-xs font-medium text-slate-300">
                {item.name}
              </label>
              <Input
                type={item.type}
                name={fieldId}
                id={fieldId}
                placeholder={item.placeHolder}
                required
                className="h-11 rounded-xl border border-white/10 bg-slate-900/90 px-4 text-sm text-white placeholder:text-slate-500 shadow-inner focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
              {errorMsg && (
                <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 px-3 py-1.5 rounded-lg mt-0.5">
                  {errorMsg}
                </p>
              )}
            </div>
          );
        })}

        {state.errors?.general && (
          <div className="text-center text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-xl">
            {state.errors["general"]}
          </div>
        )}

        {props.type === "SIGNUP" && (
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="termsConsent"
                name="termsConsent"
                required
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-slate-800 text-violet-600 focus:ring-violet-500/20 cursor-pointer accent-violet-600"
              />
              <label htmlFor="termsConsent" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                I acknowledge and agree to the{" "}
                <Link href="/terms" target="_blank" className="text-violet-400 underline hover:text-violet-300">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="text-violet-400 underline hover:text-violet-300">
                  Privacy Policy
                </Link>.
              </label>
            </div>
            {state.errors?.termsConsent && (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 px-3 py-1.5 rounded-lg mt-0.5">
                {state.errors.termsConsent}
              </p>
            )}
          </div>
        )}

        {props.type === "SIGNUP" && state.success && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-center text-xs text-emerald-300">
            Account created successfully. You can now{" "}
            <Link href="/login" className="font-semibold underline hover:text-white">
              sign in
            </Link>
            .
          </div>
        )}

        {props.type === "LOGIN" && state.success && (
          <p className="text-center text-xs text-violet-400 animate-pulse font-medium">
            Redirecting to dashboard…
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {props.type === "LOGIN"
            ? pending
              ? "Signing in…"
              : "Sign in"
            : pending
            ? "Creating account…"
            : "Create account"}
        </button>
      </form>

      {props.type === "LOGIN" ? (
        <p className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
            Sign up
          </Link>
        </p>
      ) : (
        <p className="text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
