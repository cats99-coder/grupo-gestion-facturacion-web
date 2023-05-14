export function DateToString(date: Date): string {
  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}
