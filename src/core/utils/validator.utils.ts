export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return typeof password === 'string' && password.trim().length >= 6;
}

export function validateTaskInput(title: string, dueDate: string): { isValid: boolean; error?: string } {
  if (!title || !title.trim()) {
    return { isValid: false, error: 'Task title cannot be empty.' };
  }
  if (!dueDate || isNaN(new Date(dueDate).getTime())) {
    return { isValid: false, error: 'Please specify a valid due date.' };
  }
  return { isValid: true };
}
