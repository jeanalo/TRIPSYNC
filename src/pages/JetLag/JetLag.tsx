import { useState } from 'react';
import {
  fetchCountryByName,
  calculateTimeDifference,
  CountryData,
} from '../../services/api';
import { useTravel } from '../../context/TravelContext';
import { MapPin, Clock, CalendarClock, Moon } from 'lucide-react';
import { motion } from 'motion/react';

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
          title: 'Morning Light',
          desc: 'Get 30 mins of sunlight immediately upon waking at your destination.',
        },
        {
          title: 'Caffeine Curfew',
          desc:
            absTimeDiff > 3
              ? `Stop caffeine intake after 2:00 PM in ${destination?.name || 'destination'} time.`
              : `Stop caffeine intake after 2:00 PM in ${destination?.name || 'destination'} time.`,
        },
        {
          title: 'Sleep Adjustment',
          desc:
            timeDiff > 0
              ? `Try to sleep ${Math.min(absTimeDiff, 3)} hour${Math.min(absTimeDiff, 3) > 1 ? 's' : ''} earlier each night for ${daysToAdjust} days before departure.`
              : timeDiff < 0
                ? `Try to sleep ${Math.min(absTimeDiff, 3)} hour${Math.min(absTimeDiff, 3) > 1 ? 's' : ''} later each night for ${daysToAdjust} days before departure.`
                : 'No adjustment needed — same timezone!',
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
      <motion.div
        className="px-12 py-[73px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-[30px] font-bold leading-[36px] text-[#0066D2]">
            Jet Lag Assistant
          </h1>
          <p className="text-[16px] leading-[24px] text-[#0066D2]">
            Please set up your trip first in <strong>Trip Setup</strong> to use the Jet Lag Assistant.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="px-12 py-[73px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-[30px] font-bold leading-[36px] text-[#0066D2]">
          Jet Lag Assistant
        </h1>
        <p className="text-[16px] leading-[24px] text-[#0066D2]">
          Optimize your body clock for travel.
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[30px] w-[822px]">
        {/* Country Info Card */}
        <motion.div
          className="flex items-center justify-center rounded-[15px] border-2 border-[#6cd9ce] bg-[rgba(108,217,206,0.25)] px-[44px] py-[42px]"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 gap-[65px] w-full max-w-[715px]">
            {/* Departure Country */}
            <div className="flex flex-col gap-[6px]">
              <p className="text-[20px] font-semibold leading-[36px] text-[#1CA698]">
                Departure Country
              </p>
              <div className="flex h-[52px] items-center gap-5 rounded-[15px] border border-[#1CA698] bg-white pl-5 pr-6">
                <MapPin size={24} className="shrink-0 text-[#1CA698]" />
                <span className="text-[20px] leading-[36px] text-[#1CA698]">
                  {tripDetails.departureCountry}
                </span>
              </div>
            </div>

            {/* Destination Country */}
            <div className="flex flex-col gap-[6px]">
              <p className="text-[20px] font-semibold leading-[36px] text-[#1CA698]">
                Destination Country
              </p>
              <div className="flex h-[52px] items-center gap-5 rounded-[15px] border border-[#1CA698] bg-white pl-5 pr-6">
                <MapPin size={24} className="shrink-0 text-[#1CA698]" />
                <span className="text-[20px] leading-[36px] text-[#1CA698]">
                  {tripDetails.destinationCountry}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section: Flight Details + Recommendations */}
        <div className="flex gap-[44px]">
          {/* Flight Details Card */}
          <motion.div
            className="w-[389px] shrink-0 rounded-[15px] border-2 border-[#0066D2] px-[32px] py-[30px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-[25px]">
              {/* Card Header */}
              <div className="flex items-center gap-5">
                <div className="flex h-[55px] w-[55px] items-center justify-center rounded-[15px] bg-[#0066D2]">
                  <CalendarClock size={24} className="text-white" />
                </div>
                <h2 className="text-[22px] font-bold leading-[36px] text-[#0066D2]">
                  Flight Details
                </h2>
              </div>

              {/* Departure Time */}
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="departureTime"
                  className="text-[20px] font-semibold leading-[36px] text-[#0066D2]"
                >
                  Departure Time
                </label>
                <div className="flex h-[52px] items-center gap-5 rounded-[15px] border border-[#0066D2] bg-white pl-5 pr-6">
                  <Clock size={24} className="shrink-0 text-[#0066D2]" />
                  <input
                    id="departureTime"
                    type="time"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    required
                    className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#0066D2] outline-none"
                  />
                </div>
              </div>

              {/* Arrival Time */}
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="arrivalTime"
                  className="text-[20px] font-semibold leading-[36px] text-[#0066D2]"
                >
                  Arrival Time
                </label>
                <div className="flex h-[52px] items-center gap-5 rounded-[15px] border border-[#0066D2] bg-white pl-5 pr-6">
                  <Clock size={24} className="shrink-0 text-[#0066D2]" />
                  <input
                    id="arrivalTime"
                    type="time"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    required
                    className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#0066D2] outline-none"
                  />
                </div>
              </div>

              {/* Generate Plan Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[15px] border-none bg-[#0066D2] text-[18px] font-semibold leading-[24px] text-[#F5F5F5] transition-all duration-300 hover:bg-[#0055b0] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Analyzing...' : 'Generate Plan'}
              </motion.button>
            </form>
          </motion.div>

          {/* Recommendations Card */}
          <motion.div
            className="flex h-[430px] w-[389px] shrink-0 flex-col rounded-[15px] bg-[#1CA698] pb-[42px] pl-[37px] pr-[36px] pt-[30px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {recommendations ? (
              <div className="flex flex-col gap-[22px]">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <div className="flex flex-col gap-[6px]">
                      <h3 className="text-[22px] font-bold leading-[36px] text-[#F5F5F5]">
                        {rec.title}
                      </h3>
                      <p className="text-[18px] leading-[24px] text-[#F5F5F5]">
                        {rec.desc}
                      </p>
                    </div>
                    {index < recommendations.length - 1 && (
                      <div className="mt-[22px] h-[1px] w-full bg-[#F5F5F5]" />
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-[35px]">
                {/* Placeholder header */}
                <div className="flex items-center gap-5">
                  <div className="flex h-[55px] w-[55px] items-center justify-center rounded-[15px] bg-[#6CD9CE]">
                    <Moon size={24} className="text-white" />
                  </div>
                  <p className="w-[154px] text-[22px] font-bold leading-[24px] text-[#F5F5F5]">
                    No plan generated yet
                  </p>
                </div>

                <p className="w-[269px] text-center text-[20px] leading-[24px] text-[#F5F5F5]">
                  Enter your flight details to get a personalized schedule for
                  beating jet lag.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}