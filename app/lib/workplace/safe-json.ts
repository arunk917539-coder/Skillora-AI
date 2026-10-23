/** Parse persisted JSON defensively so a legacy/corrupt row cannot crash a page or history API. */
export function parseStoredJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseStoredNumberRecord(value: string | null | undefined): Record<string, number> | null {
  const parsed = parseStoredJson<unknown>(value, null);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const entries = Object.entries(parsed);
  if (!entries.length || entries.some(([, item]) => typeof item !== "number" || !Number.isFinite(item))) return null;
  return parsed as Record<string, number>;
}

export function parseStoredArray<T>(
  value: string | null | undefined,
  isItem: (item: unknown) => item is T,
): T[] {
  const parsed = parseStoredJson<unknown>(value, null);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isItem);
}
