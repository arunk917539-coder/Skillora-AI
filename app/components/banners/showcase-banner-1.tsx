import React from "react";
import { MessageSquare, ShieldCheck, Zap, BarChart2, Compass, Award } from "lucide-react";

const containerItems = [
  {
    head: "Master Workplace",
    subhead: "Responses.",
    content: "Receive rubric-based feedback that highlights concrete behavioural signals in your written responses.",
    icon: MessageSquare,
    accent: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    head: "Communicate with",
    subhead: "Confidence.",
    content: "Practise explaining complex trade-offs clearly, respectfully, and with actionable next steps.",
    icon: Zap,
    accent: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
  },
  {
    head: "Real Workplace",
    subhead: "Scenarios.",
    content: "Work through authentic workplace situations involving cross-functional friction, tight deadlines, and competing priorities.",
    icon: Compass,
    accent: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    head: "Refine Your",
    subhead: "Delivery.",
    content: "Improve structure, clarity, empathy, and follow-through in critical workplace communications.",
    icon: Award,
    accent: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    head: "Actionable Competency",
    subhead: "Insights.",
    content: "Review multi-dimensional rubric scores and track measurable skill progression across completed assessments.",
    icon: BarChart2,
    accent: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    head: "Navigate Workplace",
    subhead: "Challenges.",
    content: "Develop core judgement across communication, teamwork, conflict resolution, ethical dilemmas, and prioritisation.",
    icon: ShieldCheck,
    accent: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
  },
];

const ShowCaseBanner1 = () => {
  return (
    <article id="features" className="pt-10 pb-16 scroll-mt-24">
      <section className="flex flex-col md:flex-row justify-between gap-6 pb-12 items-start md:items-end">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold uppercase tracking-wider text-violet-300">
            Competency Framework
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Build Stronger Workplace Skills
          </h2>
        </div>
        <p className="max-w-md text-sm sm:text-base text-slate-400 leading-relaxed">
          Develop executive judgement through realistic workplace scenarios, transparent scoring, explainable AI feedback, and deliberate practice.
        </p>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {containerItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="group relative rounded-2xl border border-white/10 bg-slate-900/60 p-7 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-violet-500/40 hover:bg-slate-900/90 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${item.accent}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono text-slate-500">0{index + 1}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-violet-200 transition-colors">
                {item.head} <span className="text-slate-400">{item.subhead}</span>
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                {item.content}
              </p>
            </div>
          );
        })}
      </section>
    </article>
  );
};

export default ShowCaseBanner1;
