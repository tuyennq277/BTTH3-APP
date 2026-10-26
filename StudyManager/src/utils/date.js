const pad = value => String(value).padStart(2, '0');
export function formatDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? 'Chưa có ngày' : `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
export function formatTime(value) {
  if (/^\d{2}:\d{2}$/.test(value || '')) {return value;}
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '--:--' : `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export const formatDateTime = value => `${formatTime(value)}, ${formatDate(value)}`;
export const isOverdue = (assignment, now = Date.now()) => assignment.status !== 'done' && new Date(assignment.dueDate).getTime() < now;
export const daysLeft = (value, now = Date.now()) => Math.ceil((new Date(value).getTime() - now) / 86400000);
export const today = () => new Date().getDay() === 0 ? 8 : new Date().getDay() + 1;
export const dayLabel = day => day === 8 ? 'Chủ nhật' : `Thứ ${day}`;
export function parseLocalDateTime(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) {return null;}
  const [, day, month, year, hour, minute] = match.map(Number);
  const d = new Date(year, month - 1, day, hour, minute);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day &&
    d.getHours() === hour && d.getMinutes() === minute ? d.toISOString() : null;
}
export const inputDateTime = value => `${formatDate(value)} ${formatTime(value)}`;
