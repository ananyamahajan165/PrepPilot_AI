/**
 * Merge Tailwind CSS classes
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Get user initials
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format time
 */
export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Truncate long text
 */
export function truncate(
  text: string,
  length = 50
): string {
  if (text.length <= length) return text;

  return text.substring(0, length) + "...";
}

/**
 * Calculate interview progress
 */
export function calculateProgress(
  completed: number,
  total: number
): number {
  if (total === 0) return 0;

  return Math.round((completed / total) * 100);
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Generate random color
 */
export function getRandomColor() {
  const colors = [
    "#4F46E5",
    "#0EA5E9",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Delay helper
 */
export function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}