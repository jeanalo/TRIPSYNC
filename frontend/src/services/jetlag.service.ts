import type { Recommendation } from '@/types/travel.types';

interface JetLagParams {
  departureTime: string;
  arrivalTime: string;
  timeDiff: number;
  destinationName: string;
}

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function generateJetLagRecommendations({
  departureTime,
  arrivalTime,
  timeDiff,
  destinationName,
}: JetLagParams): Recommendation[] {
  const absTimeDiff = Math.abs(timeDiff);
  const direction = timeDiff > 0 ? 'ahead' : timeDiff < 0 ? 'behind' : 'none';
  const daysToAdjust = Math.ceil(absTimeDiff / 1.5);

  let flightDurationMins = parseTime(arrivalTime) - parseTime(departureTime) - timeDiff * 60;
  if (flightDurationMins <= 0) flightDurationMins += 24 * 60;

  const flightDurationHours = Math.max(1, Math.min(Math.round(flightDurationMins / 60) || 1, 48));
  const arrivalHour = parseInt(arrivalTime.split(':')[0], 10);
  const perceivedArrivalHour = Math.floor((((arrivalHour - timeDiff) % 24) + 24) % 24);

  const recs: Recommendation[] = [
    {
      title: 'Morning Light',
      desc:
        perceivedArrivalHour < 12
          ? `Your body perceives it as morning (${perceivedArrivalHour}:00). Get 30 mins of sunlight immediately to reset your clock.`
          : `Your body feels like it's later in the day (${perceivedArrivalHour}:00). Avoid bright light and prioritize getting morning sun the next day.`,
    },
    {
      title: 'Caffeine Curfew',
      desc:
        perceivedArrivalHour >= 18
          ? `Your body feels like evening. Avoid caffeine during your ${flightDurationHours}-hour flight so you can sleep upon arrival.`
          : `To stay alert, you can have caffeine on the flight, but stop by 2:00 PM ${destinationName} time.`,
    },
    {
      title: 'Sleep Adjustment',
      desc:
        direction === 'ahead'
          ? `Traveling East: Try to sleep ${Math.min(absTimeDiff, 3)} hour${Math.min(absTimeDiff, 3) > 1 ? 's' : ''} earlier each night for ${daysToAdjust} days before departure.`
          : direction === 'behind'
            ? `Traveling West: Try to sleep ${Math.min(absTimeDiff, 3)} hour${Math.min(absTimeDiff, 3) > 1 ? 's' : ''} later each night for ${daysToAdjust} days before departure.`
            : 'No adjustment needed — same timezone!',
    },
    {
      title: 'Hydration',
      desc: `Drink plenty of water during your ${flightDurationHours}-hour flight. Aim for at least 8oz every hour in the air.`,
    },
  ];

  if (absTimeDiff >= 3) {
    recs.push({
      title: 'Melatonin',
      desc:
        direction === 'ahead'
          ? 'Traveling East: Consider 0.5mg - 3mg of melatonin 30 minutes before your new bedtime to help you fall asleep earlier.'
          : 'Traveling West: Consider melatonin only if you wake up in the middle of the night and cannot fall back asleep.',
    });
  }

  return recs;
}
