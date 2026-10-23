import React, { Suspense } from "react";
import Link from "next/link";
import { InterviewProgressChart } from "../interview-progress-chart";
import DashboardTabHeader from "../dashboard-tab-header";
import { SkillsPerformanceChart } from "../skill-performance-chart";
import { prisma } from "@/prisma/prisma";
import { auth } from "@/app/(auth-pages)/auth";
import Loader from "../../ui/loader";
import { AssessmentImprovement } from "../assessment-improvement";
import { RUBRIC_VERSION } from "@/app/lib/workplace/scoring";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";

const DashboardTab = async () => {
  const user = await auth();
  let Data = null;

  if (user != null) {
    Data = await prisma.user.findFirst({
      where: {
        id: user?.user?.id,
      },
      include: {
        interviews: {
          orderBy: { createdAt: "desc" },
        },
        feedBack: true,
      },
    });
  }

  const interviews = Data?.interviews ?? [];
  const totalInterViews: number = interviews.length;
  const completedInterViews: number = interviews.filter((x) => x.isCompleted === true).length;
  const inProgressInterViews: number = interviews.filter((x) => x.isCompleted !== true).length;

  const completedAssessmentIds = new Set(
    interviews
      .filter((item) => item.isCompleted === true)
      .map((item) => item.id)
  );

  // Exclude legacy interview feedback and incomplete records from workplace competency analytics.
  const feedbackRows = (Data?.feedBack ?? []).filter(
    (row) =>
      row.rubricVersion === RUBRIC_VERSION &&
      row.competencyScores &&
      completedAssessmentIds.has(row.interviewId)
  );

  const averageOf = (select: (row: (typeof feedbackRows)[number]) => number) =>
    feedbackRows.length
      ? Math.round(feedbackRows.reduce((sum, row) => sum + select(row), 0) / feedbackRows.length)
      : 0;

  const progressRecords = feedbackRows.map((row) => ({
    createdAt: row.createdAt,
    category: (Data?.interviews ?? []).find((item) => item.id === row.interviewId)?.type ?? "General",
    scores: {
      communication: row.communicationSkills,
      problemSolving: row.problemSolving,
      collaboration: row.behavioralResponses,
      accountability: row.technicalAccuracy,
      planning: row.timeManagement,
    },
  }));

  const chartData = [
    { type: "Problem Solving", value: averageOf((row) => row.problemSolving) },
    { type: "Planning", value: averageOf((row) => row.timeManagement) },
    { type: "Communication", value: averageOf((row) => row.communicationSkills) },
    { type: "Accountability", value: averageOf((row) => row.technicalAccuracy) },
    { type: "Collaboration", value: averageOf((row) => row.behavioralResponses) },
  ];

  // Real recent activity from existing data
  const recentInterviews = interviews.slice(0, 4);

  return (
    <Suspense fallback={<Loader />}>
      <div className="w-full flex flex-col gap-6 pb-12 pt-4">
        <div>
          <DashboardTabHeader
            completedInterViews={completedInterViews}
            totalInterViews={totalInterViews}
            userName={user?.user?.name}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <InterviewProgressChart
            completed={completedInterViews}
            inProgress={inProgressInterViews}
          />
          <SkillsPerformanceChart ChartData={chartData} />
        </div>

        {/* Real Recent Activity Section */}
        {recentInterviews.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-lg font-bold text-white tracking-tight">Recent Activity</h3>
              <span className="text-xs text-slate-400">
                Latest {recentInterviews.length} assessments
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentInterviews.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/5 bg-slate-800/50 p-4 flex flex-col justify-between gap-3 transition-all hover:border-white/15 hover:bg-slate-800/80"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-violet-400 truncate">
                        {item.type || "General"}
                      </span>
                      {item.isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white tracking-tight line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Difficulty: {item.difficultyLevel} · {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <Link
                    href={`/interview/${item.id}`}
                    className="inline-flex items-center justify-between text-xs font-medium text-slate-300 hover:text-white transition-colors pt-2 border-t border-white/5"
                  >
                    <span>{item.isCompleted ? "View Report" : "Continue"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <AssessmentImprovement records={progressRecords} />
      </div>
    </Suspense>
  );
};

export default DashboardTab;
