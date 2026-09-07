// utils/formatters.js
import { format, parseISO, isToday, isTomorrow } from 'date-fns';

export function formatPrice(amount) {
  if (amount === undefined || amount === null) return 'Rs 0';
  return `Rs ${Number(amount).toLocaleString('en-PK')}`;
}

export function formatDate(dateStr, pattern = 'MMM d, yyyy') {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, pattern);
}

// Friendly relative label used on appointment cards: "Today", "Tomorrow", or "Mon, Sep 3"
export function formatDateRelative(dateStr) {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEE, MMM d');
}

// "14:30" -> "2:30 PM"
export function formatTime12h(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('');
}

export function truncate(text = '', maxLength = 100) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}
