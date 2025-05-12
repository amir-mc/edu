import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTime(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
}

export function calculateGradePercentage(points: number, maxPoints: number) {
  if (maxPoints === 0) return 0;
  return (points / maxPoints) * 100;
}

export function getGradeLetter(percentage: number) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

export function calculateAttendanceRate(
  present: number,
  total: number
): number {
  if (total === 0) return 0;
  return (present / total) * 100;
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRoleColor(role: string) {
  switch (role) {
    case 'student':
      return 'bg-blue-100 text-blue-800';
    case 'teacher':
      return 'bg-green-100 text-green-800';
    case 'parent':
      return 'bg-purple-100 text-purple-800';
    case 'principal':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function generateAvatar(name: string) {
  const initials = getInitials(name);
  // Return a URL to a placeholder avatar service
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=random`;
}
