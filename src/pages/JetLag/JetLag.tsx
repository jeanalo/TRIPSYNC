import { useState } from 'react';
import {
  fetchCountryByName,
  calculateTimeDifference,
  CountryData,
} from '../../services/api';
import { useTravel } from '../../context/TravelContext';

type JetLagFormData = {
  departureTime: string;
  arrivalTime: string;
};

type Recommendation = {
  title: string;
  desc: string;
};

export default function JetLag() {
  const { tripDetails } = useTravel();

  const [formData, setFormData] = useState<JetLagFormData>({
    departureTime: '',
    arrivalTime: '',
  });

  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);

  const [countryInfo, setCountryInfo] = useState<{
    departure: CountryData | null;
    destination: CountryData | null;
    timeDiff: number;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const [departure, destination] = await Promise.all([
        fetchCountryByName(tripDetails.departureCountry),
        fetchCountryByName(tripDetails.destinationCountry),
      ]);

      let timeDiff = 0;

      if (departure && destination) {
        timeDiff = calculateTimeDifference(
          departure.timezones[0],
          destination.timezones[0]
        );
      }

      setCountryInfo({
        departure,
        destination,
        timeDiff,
      });

      const absTimeDiff = Math.abs(timeDiff);
      const direction = timeDiff > 0 ? 'ahead' : 'behind';
      const daysToAdjust = Math.ceil(absTimeDiff / 1.5);

      setRecommendations([
        {
          title: 'Morning Light Exposure',
          desc:
            absTimeDiff > 0
              ? `Your destination is ${absTimeDiff}h ${direction}. Get 30 mins of sunlight upon waking to reset your circadian rhythm. Start adjusting ${daysToAdjust} days before departure.`
              : 'No significant time difference detected. Your body clock should be fine!',
        },
        {
          title: 'Caffeine Strategy',
          desc:
            absTimeDiff > 3
              ? `With a ${absTimeDiff}h shift, stop caffeine by 2:00 PM at your destination time. Switch to water 6 hours before your target bedtime.`
              : 'Moderate time shift — limit caffeine after 3:00 PM local destination time.',
        },
        {
          title: 'Sleep Schedule Shift',
          desc:
            timeDiff > 0
              ? `Shift your bedtime ${Math.min(absTimeDiff, 3)} hours earlier over ${daysToAdjust} days before travel. Use blackout curtains and avoid screens 1h before sleep.`
              : timeDiff < 0
                ? `Shift your bedtime ${Math.min(absTimeDiff, 3)} hours later over ${daysToAdjust} days before travel. Stay active in the evening to delay sleepiness.`
                : 'No adjustment needed — same timezone!',
        },
        {
          title: 'Meal Timing',
          desc:
            absTimeDiff > 2
              ? `Start eating meals on ${destination?.name || 'destination'} time ${daysToAdjust} days before departure. This helps reset your internal clock faster than light exposure alone.`
              : 'Small time difference — just eat at local times when you arrive.',
        },
      ]);
    } catch (error) {
      console.error('Error generating jet lag plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!tripDetails.departureCountry || !tripDetails.destinationCountry) {
    return (
      <div>
        <h1>Jet Lag Assistant</h1>
        <p>Please set up your trip first in <strong>Trip Setup</strong> to use the Jet Lag Assistant.</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>Jet Lag Assistant</h1>
        <p>Optimize your body clock for travel.</p>
      </div>

      <div>
        <div>
          <h2>Flight Details</h2>

          <div>
            <p><strong>From:</strong> {tripDetails.departureCountry}</p>
            <p><strong>To:</strong> {tripDetails.destinationCountry}</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div>
              <div>
                <label htmlFor="departureTime">Departure Time</label>
                <input
                  id="departureTime"
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="arrivalTime">Arrival Time</label>
                <input
                  id="arrivalTime"
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Analyzing...' : 'Generate Plan'}
            </button>
          </form>

          {countryInfo?.departure && countryInfo?.destination && (
            <div>
              <div>
                <img
                  src={countryInfo.departure.flag}
                  alt={countryInfo.departure.name}
                  width={24}
                />
                <span>{countryInfo.departure.name}</span>
                <span>{countryInfo.departure.timezones[0]}</span>
              </div>

              <div>
                <img
                  src={countryInfo.destination.flag}
                  alt={countryInfo.destination.name}
                  width={24}
                />
                <span>{countryInfo.destination.name}</span>
                <span>{countryInfo.destination.timezones[0]}</span>
              </div>

              <div>
                <strong>{Math.abs(countryInfo.timeDiff)}h time difference</strong>
              </div>
            </div>
          )}
        </div>

        <div>
          {recommendations ? (
            recommendations.map((rec, index) => (
              <div key={index}>
                <h3>{rec.title}</h3>
                <p>{rec.desc}</p>
              </div>
            ))
          ) : (
            <div>
              <h3>No plan generated yet</h3>
              <p>
                Enter your flight details to get a personalized schedule for
                beating jet lag.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}