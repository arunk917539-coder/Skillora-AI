"use client";

import { useSession } from "next-auth/react";
import React from "react";

type DashboardHeaderProps = {
  completedInterViews: number;
  totalInterViews: number;
};

const DashboardTabHeader = (props: DashboardHeaderProps) => {
  const session = useSession();

  const total = Math.max(0, props.totalInterViews);
  const completed = Math.min(total, Math.max(0, props.completedInterViews));
  const inProgress = total - completed;

  const metrics = [
    {
      label: "Total assessments",
      value: total,
      description: "All assessments created",
    },
    {
      label: "Completed",
      value: completed,
      description: "Assessments finished",
    },
    {
      label: "In progress",
      value: inProgress,
      description: "Assessments remaining",
    },
  ];

  return (
    <section className="flex w-full flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-slate-500">
          YOUR WORKPLACE COMPASS
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Welcome back{session.data?.user?.name ? "," : ""}
          {session.data?.user?.name ? (
            <span> {session.data.user.name}</span>
          ) : ""}
        </h2>
        <p className="mt-2 text-sm text-slate-600 md:text-base">
          Track your workplace assessment activity and development.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {metric.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {metric.value.toString().padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {metric.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardTabHeader;
