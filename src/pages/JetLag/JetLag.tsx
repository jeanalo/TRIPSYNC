import { useState, useEffect } from 'react';
import {
  fetchCountryByName,
  calculateTimeDifference,
  CountryData,
} from '../../services/api';
import { useTravel } from '../../context/TravelContext';
import { MapPin, Clock, CalendarClock, Moon } from 'lucide-react';
import { motion } from 'motion/react';

import PageHeader from '../../components/PageHeader/PageHeader';
import FormCard from '../../components/FormCard/FormCard';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import DetailCard from '../../components/DetailCard/DetailCard';
import CardHeader from '../../components/CardHeader/CardHeader';
import IconBadge from '../../components/IconBadge/IconBadge';

type JetLagFormData = {
  departureTime: string;
  arrivalTime: string;
};

type Recommendation = {
  title: string;
  desc: string;
};

export default function JetLag() {
  const { tripDetails, jetLagPlan, setJetLagPlan } = useTravel();

  const [formData, setFormData] = useState<JetLagFormData>({
    departureTime: jetLagPlan?.departureTime || '',
    arrivalTime: jetLagPlan?.arrivalTime || '',
  });

  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(
    jetLagPlan?.recommendations || null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jetLagPlan) {
      setFormData({
        departureTime: jetLagPlan.departureTime || '',
        arrivalTime: jetLagPlan.arrivalTime || '',
      });
      setRecommendations(jetLagPlan.recommendations || null);
    } else {
      setFormData({
        departureTime: '',
        arrivalTime: '',
      });
      setRecommendations(null);
    }
  }, [jetLagPlan]);

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
    
    if (!formData.departureTime || !formData.arrivalTime) return;
    
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
      const direction = timeDiff > 0 ? 'ahead' : timeDiff < 0 ? 'behind' : 'none';
      const daysToAdjust = Math.ceil(absTimeDiff / 1.5);

      const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };

      const depMins = parseTime(formData.departureTime);
      const arrMins = parseTime(formData.arrivalTime);

      let flightDurationMins = arrMins - depMins - (timeDiff * 60);
      if (flightDurationMins <= 0) flightDurationMins += 24 * 60;

      // Previous validations 
      const flightDurationHours = Math.max(1, Math.min(Math.round(flightDurationMins / 60) || 1, 48));

      const arrivalHour = parseInt(formData.arrivalTime.split(':')[0], 10);
      const perceivedArrivalHour = Math.floor(((arrivalHour - timeDiff) % 24 + 24) % 24);

      const recs: Recommendation[] = [
        {
          title: 'Morning Light',
          desc: perceivedArrivalHour < 12 
            ? `Your body perceives it as morning (${perceivedArrivalHour}:00). Get 30 mins of sunlight immediately to reset your clock.`
            : `Your body feels like it's later in the day (${perceivedArrivalHour}:00). Avoid bright light and prioritize getting morning sun the next day.`,
        },
        {
          title: 'Caffeine Curfew',
          desc: perceivedArrivalHour >= 18
              ? `Your body feels like evening. Avoid caffeine during your ${flightDurationHours}-hour flight so you can sleep upon arrival.`
              : `To stay alert, you can have caffeine on the flight, but stop by 2:00 PM ${destination?.name || 'destination'} time.`,
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
        }
      ];

      if (absTimeDiff >= 3) {
        recs.push({
          title: 'Melatonin',
          desc: direction === 'ahead'
            ? 'Traveling East: Consider 0.5mg - 3mg of melatonin 30 minutes before your new bedtime to help you fall asleep earlier.'
            : 'Traveling West: Consider melatonin only if you wake up in the middle of the night and cannot fall back asleep.'
        });
      }

      setRecommendations(recs);
      setJetLagPlan({
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        recommendations: recs,
      });
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
      <div className="flex flex-col gap-[30px] px-4 lg:pl-12 lg:pr-4">
        {/* Country Info Card */}
        <FormCard className="flex w-full lg:w-[822px] items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-[65px] w-full lg:max-w-[715px]">
            <FormField
              label="Departure Country"
              value={tripDetails.departureCountry}
              icon={<MapPin size={24} />}
            />
            <FormField
              label="Destination Country"
              value={tripDetails.destinationCountry}
              icon={<MapPin size={24} />}
            />
          </div>
        </FormCard>

        {/* Bottom Section: Flight Details + Recommendations */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-[44px] items-center lg:items-start w-full lg:w-[822px]">
          {/* Flight Details Card */}
          <DetailCard className="w-full lg:w-[389px] flex-1 lg:flex-none h-auto lg:h-[430px]" delay={0.3} animateFrom="left">
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
            className="flex h-auto lg:h-[430px] w-full lg:w-[389px] flex-1 lg:flex-none flex-col rounded-[15px] bg-[#1CA698] px-6 lg:px-[32px] py-6 lg:py-[30px]"
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
                  <IconBadge color="teal" size="lg">
                    <Moon size={24} />
                  </IconBadge>
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