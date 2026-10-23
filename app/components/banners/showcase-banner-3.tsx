"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { HelpCircle } from "lucide-react";
import { ScrollReveal } from "../ui/scroll-reveal";

const workplaceTips = [
  {
    num: "01",
    head: "Respond to Workplace Pressure",
    subhead:
      "Tight deadlines and difficult conversations can make it harder to think clearly. Use realistic practice scenarios to plan a response, explain your reasoning, and identify concrete next steps before facing high-stakes situations.",
  },
  {
    num: "02",
    head: "Navigate Difficult Situations",
    subhead:
      "Workplace situations rarely have one single correct answer. Practise assessing risks, listening to affected colleagues, and choosing a fair, pragmatic course of action that balances competing stakeholder interests.",
  },
  {
    num: "03",
    head: "Understand Your Competency Signals",
    subhead:
      "Review rubric-based indicators for communication, collaboration, problem solving, accountability, and planning. Feedback is transparent and formative, giving you clear signals of what was done well and where to improve.",
  },
  {
    num: "04",
    head: "Build a Repeatable Practice Habit",
    subhead:
      "Complete focused scenarios on your own schedule. Review targeted development activities, identify weak areas, and attempt follow-up scenarios to observe measurable improvement over time.",
  },
  {
    num: "05",
    head: "Turn Feedback into Action",
    subhead:
      "Each assessment generates actionable, priority-ranked development recommendations. From clarifying mutual expectations to confirming task ownership, translate AI insights directly into everyday workplace excellence.",
  },
];

const ShowcaseBanner3 = () => {
  return (
    <article className="pt-8 pb-16">
      <ScrollReveal delay={40} className="flex flex-col md:flex-row justify-between gap-6 pb-10 items-start md:items-end">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold uppercase tracking-wider text-violet-300">
            <HelpCircle className="h-3.5 w-3.5" />
            Methodology & Practice
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How Skillora AI Accelerates Growth
          </h2>
        </div>
        <p className="max-w-md text-sm sm:text-base text-slate-400 leading-relaxed">
          Practise workplace decisions, understand rubric signals, and use tailored development recommendations to continuously elevate your professional impact.
        </p>
      </ScrollReveal>

      <section className="w-full">
        <Accordion type="single" className="flex flex-col gap-4" collapsible>
          {workplaceTips.map((item, index) => {
            return (
              <ScrollReveal
                key={index}
                delay={index * 50}
                className="w-full"
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all duration-300 data-[state=open]:border-violet-500/40 data-[state=open]:bg-slate-900/90"
                >
                  <AccordionTrigger className="w-full px-6 py-5 hover:no-underline text-left group">
                    <div className="flex items-center gap-4 text-left">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 font-mono text-sm font-bold text-violet-400 group-hover:border-violet-500/30 group-hover:text-violet-300 transition-colors">
                        {item.num}
                      </span>
                      <span className="text-base sm:text-lg font-semibold text-white tracking-tight group-hover:text-violet-200 transition-colors">
                        {item.head}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed pl-20">
                    {item.subhead}
                  </AccordionContent>
                </AccordionItem>
              </ScrollReveal>
            );
          })}
        </Accordion>
      </section>
    </article>
  );
};

export default ShowcaseBanner3;
