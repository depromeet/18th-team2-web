export function formatArchiveNoticeDate(writableUntil?: string) {
  if (!writableUntil) return undefined;

  const date = new Date(writableUntil);
  if (Number.isNaN(date.getTime())) return undefined;

  date.setDate(date.getDate() - 7);
  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function formatArchiveNoticePartyName(hostName?: string) {
  return hostName ? `${hostName}의 파티` : '내 파티';
}
