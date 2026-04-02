import { useState } from 'react';
import {
  fetchCountryByName,
  calculateTimeDifference,
  CountryData,
} from '../../services/api';
import { useTravel } from '../../context/TravelContext';
import { MapPin, Clock, CalendarClock, Moon } from 'lucide-react';
import { motion } from 'motion/react';

import PageHeader from '../../components/ui/PageHeader';
import FormCard from '../../components/ui/FormCard';
import FormField from '../../components/ui/FormField';
import InfoField from '../../components/ui/InfoField';
import SubmitButton from '../../components/ui/SubmitButton';
import DetailCard from '../../components/ui/DetailCard';
import CardHeader from '../../components/ui/CardHeader';

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
      <PageHeader
        title="Jet Lag Assistant"
        subtitle={
          <>
            Please set up your trip first in <strong>Trip Setup</strong> to use the Jet Lag Assistant.
          </>
        }
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Jet Lag Assistant"
        subtitle="Optimize your body clock for travel."
      />

      {/* Content */}
      <div className="flex flex-col gap-[30px] pl-12">
        {/* Country Info Card */}
        <FormCard className="flex w-[822px] items-center justify-center">
          <div className="grid grid-cols-2 gap-[65px] w-full max-w-[715px]">
            <InfoField
              label="Departure Country"
              value={tripDetails.departureCountry}
              icon={<MapPin size={24} />}
            />
            <InfoField
              label="Destination Country"
              value={tripDetails.destinationCountry}
              icon={<MapPin size={24} />}
            />
          </div>
        </FormCard>

        {/* Bottom Section: Flight Details + Recommendations */}
        <div className="flex gap-[44px] items-start">
          {/* Flight Details Card */}
          <DetailCard className="w-[389px] h-[430px] shrink-0" delay={0.3} animateFrom="left">
            <form onSubmit={handleSubmit} className="flex h-full flex-col gap-[25px]">
              <CardHeader
                icon={<CalendarClock size={24} />}
                title="Flight Details"
              />

              {/* Departure Time */}
              <FormField
                label="Departure Time"
                icon={<Clock size={24} />}
                colorScheme="blue"
              >
                <input
                  id="departureTime"
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#0066D2] outline-none"
                />
              </FormField>

              {/* Arrival Time */}
              <FormField
                label="Arrival Time"
                icon={<Clock size={24} />}
                colorScheme="blue"
              >
                <input
                  id="arrivalTime"
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  required
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#0066D2] outline-none"
                />
              </FormField>

              {/* Generate Plan Button */}
              <div className="mt-auto">
                <SubmitButton loading={loading} loadingText="Analyzing...">
                  Generate Plan
                </SubmitButton>
              </div>
            </form>
          </DetailCard>

          {/* Recommendations Card */}
          <motion.div
            className="flex h-[430px] w-[389px] shrink-0 flex-col rounded-[15px] bg-[#1CA698] px-[32px] py-[30px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {recommendations ? (
              <div className="flex flex-col gap-[22px] overflow-y-auto">
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
                  <div className="flex h-[55px] w-[55px] shrink-0 items-center justify-center rounded-[15px] bg-[#6CD9CE]">
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
    </div>
  );
}