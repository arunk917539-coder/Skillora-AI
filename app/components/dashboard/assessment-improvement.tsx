import { compareProgress, type ProgressRecord } from "@/app/lib/workplace/progress";

export function AssessmentImprovement({ records }: { records: ProgressRecord[] }) {
  const result = compareProgress(records);
  return <section className="rounded-2xl border bg-white/70 p-5 space-y-3">
    <div><h3 className="text-lg font-semibold">Progress between assessments{result.available ? ` · ${result.category}` : ""}</h3><p className="text-sm text-muted-foreground">Compare the first and latest completed result within the same scenario category.</p></div>
    {!result.available ? <p className="text-sm text-muted-foreground">{result.message}</p> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{result.changes.map(item => <div key={item.competency} className="rounded-lg bg-muted/60 p-3"><p className="text-sm capitalize text-muted-foreground">{item.competency.replace(/([A-Z])/g, " $1")}</p><p className="text-xl font-semibold">{(item.latest / 10).toFixed(1)}<span className="text-xs font-normal"> / 10</span></p><p className={`text-sm ${item.change > 0 ? "text-green-700" : item.change < 0 ? "text-amber-700" : "text-muted-foreground"}`}>{item.change > 0 ? "+" : ""}{(item.change / 10).toFixed(1)} points / 10 since first result</p></div>)}</div>}
    <p className="text-xs text-muted-foreground">Progress comparisons are indicative and may be affected by scenario differences.</p>
  </section>;
}
