import Link from "next/link";
import Image from "next/image";
import { TabsList, TabsTrigger } from "../../ui/tabs";
import { useSession } from "next-auth/react";
import { SignOutButton } from "../../auth/sign-out";
import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";

const Tabitems = [
  { value: "Dashboard", key: "dashboard" },
  { value: "Workplace Assessments", key: "mock_interviews" },
  { value: "Create Assessment", key: "create_interview" },
  { value: "Assessment History", key: "interview_history" },
];

export type AppSideBar = {
  callBack: Dispatch<SetStateAction<boolean>>;
  isHr?: boolean;
};

export function AppSidebar({ callBack, isHr: isHrProp }: AppSideBar) {
  const session = useSession();
  const user = session.data?.user;
  const isHr = isHrProp ?? ((user as { role?: string | null })?.role === "hr");
  const tabItems = isHr
    ? [...Tabitems, { value: "Manage Questions", key: "hr_questions" }]
    : Tabitems;

  return (
    <div className="fixed inset-y-0 left-0 z-50 flex w-4/5 max-w-xs flex-col justify-between border-r border-white/10 bg-slate-900/95 p-6 backdrop-blur-xl lg:hidden shadow-2xl">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={() => callBack(false)}>
            <div className="relative h-9 w-40">
              <Image
                src="/skillora-horizontal.png"
                alt="Skillora AI"
                fill
                className="object-contain object-left"
              />
            </div>
          </Link>
          <button
            onClick={() => callBack(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-2 items-stretch">
          {tabItems.map((item, index) => (
            <TabsTrigger
              key={index}
              value={item.key}
              onClick={() => callBack(false)}
              className="justify-start px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              {item.value}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {user && (
        <div className="border-t border-white/10 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white ring-1 ring-white/20">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col truncate max-w-[120px]">
              <span className="text-xs font-medium text-white truncate">{user.name ?? "User"}</span>
              <span className="text-[10px] text-slate-400 truncate">{user.email ?? ""}</span>
            </div>
          </div>
          <SignOutButton />
        </div>
      )}
    </div>
  );
}
