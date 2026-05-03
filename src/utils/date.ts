export function getTodayMidnight(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function formatKoreanDate(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function formatDotDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()} · ${mm} · ${dd}`;
}

export function formatDisplayTime(value: { period: string; hour: string; minute: string }): string {
  return `${value.period} ${value.hour}:${value.minute}`;
}
