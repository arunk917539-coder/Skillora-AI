"use server";

import React from "react";
import AuthHeader from "@/app/components/auth/auth-header";
import AuthForm from "@/app/components/auth/auth-form";

const formItems = [
  { name: "Email", type: "email", placeHolder: "name@company.com" },
  { name: "Password", type: "password", placeHolder: "Enter your password" },
];

const SignInPage = async () => {
  return (
    <article className="flex w-full min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
        <AuthHeader />
        <AuthForm formItems={formItems} type="LOGIN" />
      </div>
    </article>
  );
};

export default SignInPage;
