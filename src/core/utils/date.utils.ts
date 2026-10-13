const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatShortDate(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  return `${day} ${month}`;
}

export function formatHeaderDate(dateInput: string | Date | number = new Date()): string {
  const d = new Date(dateInput);
  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  return `Today, ${day} ${month}`;
}

export function formatFullDate(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const dayName = DAYS_SHORT[d.getDay()];
  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
}

export function formatTime(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export type TaskTimeBucket = 'Today' | 'Tomorrow' | 'This week' | 'Later' | 'Overdue';

export function getTaskTimeBucket(dueDateInput: string | Date | number): TaskTimeBucket {
  const dueDate = new Date(dueDateInput);
  if (isNaN(dueDate.getTime())) return 'Later';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(dueDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return 'This week';
  return 'Later';
}

/**
 * Sorts tasks by due date (earliest to latest) as requested in requirements
 */
export function sortByDueDate<T extends { dueDate: string }>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    const timeA = new Date(a.dueDate).getTime() || 0;
    const timeB = new Date(b.dueDate).getTime() || 0;
    return timeA - timeB;
  });
}
