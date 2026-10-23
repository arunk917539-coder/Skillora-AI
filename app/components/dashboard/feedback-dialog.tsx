import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DevelopmentPlan } from "./development-plan";
import type { DevelopmentAction } from "@/app/lib/workplace/development-plans";

export function FeedBackDialog({ feedBack, interviewtitle, score, recommendations }: { feedBack: string; interviewtitle: string; score?: number | null; recommendations?: DevelopmentAction[] | null }) {
  return <Dialog><DialogTrigger asChild><Button variant="outline">View</Button></DialogTrigger>
    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader><DialogTitle>{interviewtitle}</DialogTitle><DialogDescription>{score != null ? `Overall practice score: ${(score / 10).toFixed(1)}/10` : "Assessment feedback"}</DialogDescription></DialogHeader>
      <p className="text-sm leading-relaxed">{feedBack}</p>
      <DevelopmentPlan items={recommendations ?? []} />
      <p className="text-xs text-muted-foreground">Ollama-powered AI practice feedback can make mistakes and is not a validated employment or psychological assessment.</p>
    </DialogContent>
  </Dialog>;
}
