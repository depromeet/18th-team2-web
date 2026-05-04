import dayjs, { KST } from '@/lib/dayjs';

export function getTodayMidnight(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function formatKoreanDate(d: Date | string): string {
  if (typeof d === 'string') {
    const date = dayjs.tz(d, KST);
    return `${date.year()}년 ${date.month() + 1}월 ${date.date()}일`;
  }
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function formatKoreanTime(startsAt: string): string {
  const d = dayjs.tz(startsAt, KST);
  const hour = d.hour();
  const minute = d.minute();
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = String(minute).padStart(2, '0');
  return `${period} ${displayHour}:${displayMinute}`;
}

export function formatDateParts(startsAt: string): { year: number; month: number; day: number } {
  const d = dayjs.tz(startsAt, KST);
  return { year: d.year(), month: d.month() + 1, day: d.date() };
}

export function formatDotDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()} · ${mm} · ${dd}`;
}

export function formatDisplayTime(value: { period: string; hour: string; minute: string }): string {
  return `${value.period} ${value.hour}:${value.minute}`;
}
