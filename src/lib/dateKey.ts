// Day boundary for daily free spins: device-local midnight (KST for Korean users), not UTC.
export function dateKey(ts: number = Date.now()): string {
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
