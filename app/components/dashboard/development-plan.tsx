import type { DevelopmentAction } from "@/app/lib/workplace/development-plans";

export function DevelopmentPlan({ items }: { items: DevelopmentAction[] }) {
  const safeItems = Array.isArray(items) ? items.filter((item) =>
    Boolean(item && typeof item.label === "string" && typeof item.score === "number" &&
      typeof item.reason === "string" && Array.isArray(item.actions) &&
      item.actions.every((action) => typeof action === "string"))
  ) : [];
  if (!safeItems.length) return null;
  return <section className="space-y-3 rounded-xl border p-4" aria-labelledby="development-plan-heading">
    <div><h3 id="development-plan-heading" className="text-lg font-semibold">Your development plan</h3><p className="text-sm text-muted-foreground">Start with one practical action. These suggestions are linked to practice scores, not formal employee evaluations.</p></div>
    <div className="grid gap-3 md:grid-cols-2">
      {safeItems.slice(0, 2).map((item) => <article key={item.competency} className="rounded-lg bg-muted/50 p-3">
        <div className="flex items-center justify-between gap-2"><h4 className="font-medium">{item.label}</h4><span className="text-sm font-semibold">{(item.score / 10).toFixed(1)}/10</span></div>
        <p className="mt-1 text-sm text-muted-foreground">{item.reason}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{item.actions.map((action) => <li key={action}>{action}</li>)}</ul>
      </article>)}
    </div>
  </section>;
}
