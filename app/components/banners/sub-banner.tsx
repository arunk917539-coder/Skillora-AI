import React from "react";
import { ScrollReveal } from "../ui/scroll-reveal";

const workplaceBenefits = [
  { label: "Realistic Scenarios", accent: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20" },
  { label: "Rubric-Based Feedback", accent: "text-violet-400 border-violet-500/20 bg-violet-950/20" },
  { label: "Practical Next Steps", accent: "text-amber-400 border-amber-500/20 bg-amber-950/20" },
  { label: "Five Competency Areas", accent: "text-blue-400 border-blue-500/20 bg-blue-950/20" },
  { label: "Written Reflection", accent: "text-indigo-400 border-indigo-500/20 bg-indigo-950/20" },
  { label: "Repeatable Practice", accent: "text-purple-400 border-purple-500/20 bg-purple-950/20" },
  { label: "Progress Tracking", accent: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20" },
];

const SubBanner = () => {
  return (
    <section className="hidden md:flex flex-wrap justify-center gap-3.5 px-4 my-8 md:my-12">
      {workplaceBenefits.map((item, index) => (
        <ScrollReveal
          key={index}
          delay={index * 40}
          as="span"
          className={`text-sm font-medium ${item.accent} px-4 py-2 rounded-full border shadow-sm backdrop-blur transition-all duration-300 hover:scale-105 hover:brightness-125 cursor-default`}
        >
          {item.label}
        </ScrollReveal>
      ))}
    </section>
  );
};

export default SubBanner;
