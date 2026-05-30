import { useState } from 'react';
import { useTrip } from '../../context/TripProvider';
import { MapPin, Clock, CalendarClock, Moon } from 'lucide-react';
import { motion } from 'motion/react';

import PageHeader from '../../components/PageHeader/PageHeader';
import FormCard from '../../components/FormCard/FormCard';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import DetailCard from '../../components/DetailCard/DetailCard';
import CardHeader from '../../components/CardHeader/CardHeader';
import IconBadge from '../../components/IconBadge/IconBadge';

export default function JetLag() {
  const { tripDetails, jetLagPlan, generateJetLagPlan } = useTrip();

  const [departureTime, setDepartureTime] = useState(jetLagPlan?.departureTime ?? '');
  const [arrivalTime, setArrivalTime] = useState(jetLagPlan?.arrivalTime ?? '');
  const [loading, setLoading] = useState(false);

  const recommendations = jetLagPlan?.recommendations ?? null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!departureTime || !arrivalTime) return;
    setLoading(true);
    try {
      await generateJetLagPlan(departureTime, arrivalTime);
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
            Please set up your trip first in <strong>Trip Setup</strong> to use the Jet
            Lag Assistant.
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

      <div className="flex flex-col gap-[30px] px-4 lg:pl-12 lg:pr-4">
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

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-[44px] items-center lg:items-start w-full lg:w-[822px]">
          <DetailCard
            className="w-full lg:w-[389px] flex-1 lg:flex-none h-auto lg:h-[430px]"
            delay={0.3}
            animateFrom="left"
          >
            <form onSubmit={handleSubmit} className="flex h-full flex-col gap-[25px]">
              <CardHeader icon={<CalendarClock size={24} />} title="Flight Details" />

              <FormField label="Departure Time" icon={<Clock size={24} />} colorScheme="blue">
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  required
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#0066D2] outline-none"
                />
              </FormField>

              <FormField label="Arrival Time" icon={<Clock size={24} />} colorScheme="blue">
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  required
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#0066D2] outline-none"
                />
              </FormField>

              <div className="mt-auto">
                <SubmitButton loading={loading} loadingText="Analyzing...">
                  Generate Plan
                </SubmitButton>
              </div>
            </form>
          </DetailCard>

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
                      <p className="text-[18px] leading-[24px] text-[#F5F5F5]">{rec.desc}</p>
                    </div>
                    {index < recommendations.length - 1 && (
                      <div className="mt-[22px] h-[1px] w-full bg-[#F5F5F5]" />
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-[35px]">
                <div className="flex items-center gap-5">
                  <IconBadge color="teal" size="lg">
                    <Moon size={24} />
                  </IconBadge>
                  <p className="w-[154px] text-[22px] font-bold leading-[24px] text-[#F5F5F5]">
                    No plan generated yet
                  </p>
                </div>
                <p className="w-[269px] text-center text-[20px] leading-[24px] text-[#F5F5F5]">
                  Enter your flight details to get a personalized schedule for beating jet lag.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
