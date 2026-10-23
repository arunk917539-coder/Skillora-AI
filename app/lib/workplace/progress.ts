import type { CompetencyKey } from "./scoring";

export type ProgressRecord = {
  createdAt: Date | string;
  category?: string;
  scores: Partial<Record<CompetencyKey, number>>;
};

/** Compare first and latest completed records from the same category. */
export function compareProgress(records: ProgressRecord[]) {
  const ordered = [...records].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  if (ordered.length < 2) return { available: false as const, message: "Complete at least two comparable assessments to see progress." };

  const latestRecord = ordered[ordered.length - 1];
  const comparable = latestRecord.category
    ? ordered.filter((record) => record.category === latestRecord.category)
    : ordered;
  if (comparable.length < 2) {
    return { available: false as const, message: "Complete another assessment in the same category to compare progress." };
  }

  const first = comparable[0].scores;
  const latest = comparable[comparable.length - 1].scores;
  const keys: CompetencyKey[] = ["communication", "problemSolving", "collaboration", "accountability", "planning"];
  const changes = keys.filter((key) => typeof first[key] === "number" && typeof latest[key] === "number").map((key) => {
    const firstScore = first[key] as number;
    const latestScore = latest[key] as number;
    return { competency: key, first: firstScore, latest: latestScore, change: latestScore - firstScore };
  });
  if (!changes.length) return { available: false as const, message: "These assessments have no shared competency scores to compare." };
  return { available: true as const, assessmentsCompared: comparable.length, category: latestRecord.category ?? "All categories", changes };
}
