import React from "react";
import CreateInterviewForm from "../create-interview-form";
import Image from "next/image";

const CreateInterviewTab = () => {
  return (
    <div className="relative mt-4 flex w-full flex-col lg:flex-row items-center justify-between gap-10 rounded-3xl border border-white/10 bg-slate-900/75 p-6 sm:p-10 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-violet-600/10 blur-[100px]" />

      <div className="w-full lg:max-w-xl z-10">
        <CreateInterviewForm />
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-slate-800/40 backdrop-blur z-10">
        <Image
          src="/typing-bro.svg"
          className="w-full max-w-sm h-auto drop-shadow-2xl"
          height={340}
          width={340}
          alt="Workplace scenario simulation illustration"
          priority
        />
        <p className="mt-3 text-xs text-slate-400 text-center font-medium">
          Local AI simulation with transparent rubric evaluation
        </p>
      </div>
    </div>
  );
};

export default CreateInterviewTab;
