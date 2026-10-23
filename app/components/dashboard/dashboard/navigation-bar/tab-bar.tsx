import React from "react";
import { TabsList, TabsTrigger } from "../../ui/tabs";

const baseTabItems = [
  { value: "Dashboard", key: "dashboard" },
  { value: "Workplace Assessments", key: "mock_interviews" },
  { value: "Create Assessment", key: "create_interview" },
  { value: "Assessment History", key: "interview_history" },
];

const TabBar = ({ isHr }: { isHr?: boolean }) => {
  const tabItems = isHr
    ? [...baseTabItems, { value: "Manage Questions", key: "hr_questions" }]
    : baseTabItems;

  return (
    <TabsList className="h-11 items-center gap-1.5 p-1 rounded-full bg-slate-900/90 border border-white/10 shadow-inner backdrop-blur-md">
      {tabItems.map((item, index) => (
        <TabsTrigger
          key={index}
          value={item.key}
          className="h-9 px-4 text-xs font-medium rounded-full text-slate-400 transition-all duration-200 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-violet-500/25"
        >
          {item.value}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default TabBar;
