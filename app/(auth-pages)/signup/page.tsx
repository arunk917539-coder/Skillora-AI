import AuthForm from "@/app/components/auth/auth-form";
import AuthHeader from "@/app/components/auth/auth-header";
import React from "react";

const formItems = [
  { name: "Full Name", type: "text", placeHolder: "Your full name" },
  { name: "Email", type: "email", placeHolder: "name@company.com" },
  { name: "Password", type: "password", placeHolder: "Create a password" },
  { name: "Confirm Password", type: "password", placeHolder: "Confirm your password" },
];

const SignUpPage = () => {
  return (
    <article className="flex w-full min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
        <AuthHeader />
        <AuthForm formItems={formItems} type="SIGNUP" />
      </div>
    </article>
  );
};

export default SignUpPage;
