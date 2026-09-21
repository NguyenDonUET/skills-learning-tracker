export function formatHours(hours: number): string {
  if (Number.isInteger(hours)) return String(hours);
  return hours.toFixed(1).replace(/\.0$/, "");
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatShortDate(isoDate: string, locale = "en"): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}
