import type { Activity } from '@/types/travel.types';

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

export function groupByDate(activities: Activity[]): Record<string, Activity[]> {
  return activities.reduce(
    (acc, act) => {
      if (!acc[act.date]) acc[act.date] = [];
      acc[act.date].push(act);
      return acc;
    },
    {} as Record<string, Activity[]>
  );
}
