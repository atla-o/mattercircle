export function slotLabel(categoryName: string, n: number | string): string {
  const lower = categoryName.toLowerCase();
  const singular = lower.endsWith("ies")
    ? `${lower.slice(0, -3)}y`
    : lower.endsWith("s")
      ? lower.slice(0, -1)
      : lower;
  return `${singular} ${n}`;
}
