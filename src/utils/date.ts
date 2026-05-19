import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const KST = 'Asia/Seoul';

export function getTodayMidnight(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function formatKoreanDate(d: Date): string {
  const date = dayjs(d).tz(KST);
  return `${date.year()}년 ${date.month() + 1}월 ${date.date()}일`;
}

export function formatKoreanTime(startsAt: Date): string {
  const d = dayjs(startsAt).tz(KST);
  const hour = d.hour();
  const minute = d.minute();
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = String(minute).padStart(2, '0');
  return `${period} ${displayHour}:${displayMinute}`;
}

export function formatDateParts(startsAt: Date): { year: number; month: number; day: number } {
  const d = dayjs(startsAt).tz(KST);
  return { year: d.year(), month: d.month() + 1, day: d.date() };
}

export function formatIsoDate(d: Date): string {
  const { year, month, day } = formatDateParts(d);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatKoreanShortDate(d: Date): string {
  const date = dayjs(d).tz(KST);
  return `${date.month() + 1}월 ${String(date.date()).padStart(2, '0')}일`;
}

export function addDays(d: Date, days: number): Date {
  return dayjs(d).add(days, 'day').toDate();
}

export function formatDotDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()} · ${mm} · ${dd}`;
}

export function formatDisplayTime(value: { period: string; hour: string; minute: string }): string {
  return `${value.period} ${value.hour}:${value.minute}`;
}

// 보관함 카드 표기용. ISO date-time → `YY.MM.DD` (예: 2026-05-12T22:10:00+09:00 → 26.05.12)
export function formatArchiveDate(isoDate: string): string {
  return dayjs(isoDate).tz(KST).format('YY.MM.DD');
}
