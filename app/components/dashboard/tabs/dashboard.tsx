import React, { Suspense } from 'react'
import { InterviewProgressChart } from '../interview-progress-chart'
import DashboardTabHeader from '../dashboard-tab-header'
import { SkillsPerformanceChart } from '../skill-performance-chart'
import { prisma } from '@/prisma/prisma'
import { auth } from '@/app/(auth-pages)/auth'
import Loader from '../../ui/loader'
import { AssessmentImprovement } from '../assessment-improvement'
import { RUBRIC_VERSION } from '@/app/lib/workplace/scoring'

const DashboardTab = async () => {
  const user = await auth();
  let Data = null;

  if (user != null) {
    Data = await prisma.user.findFirst({
      where: {
        id: user?.user?.id
      },
      include: {
        interviews: true,
        feedBack: true
      }
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
  const feedbackRows = (Data?.feedBack ?? []).filter((row) =>
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

  return (
    <Suspense fallback={<Loader />}>
      <div className='w-full flex flex-col gap-5 pb-10 xl:pb-0 overflow-auto md:overflow-y-none'>
        <div>
          <DashboardTabHeader
            completedInterViews={completedInterViews}
            totalInterViews={totalInterViews}
          />
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>
          <InterviewProgressChart
            completed={completedInterViews}
            inProgress={inProgressInterViews}
          />
          <SkillsPerformanceChart ChartData={chartData} />
        </div>

        <AssessmentImprovement records={progressRecords} />
      </div>
    </Suspense>
  )
}

export default DashboardTab
