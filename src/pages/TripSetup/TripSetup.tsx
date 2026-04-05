import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTravel, TripDetails } from '../../context/TravelContext';
import { MapPin, CalendarDays, CheckCircle } from 'lucide-react';

import PageHeader from '../../components/ui/PageHeader';
import FormCard from '../../components/ui/FormCard';
import FormField from '../../components/ui/FormField';
import SubmitButton from '../../components/ui/SubmitButton';
import CountrySelect from '../../components/ui/CountrySelect';

export default function TripSetup() {
  const { tripDetails, setTripDetails } = useTravel();
  const navigate = useNavigate();
  const { register, handleSubmit, control, reset } = useForm<TripDetails>({
    defaultValues: tripDetails,
  });

  useEffect(() => {
    reset(tripDetails);
  }, [tripDetails, reset]);

  const onSubmit = (data: TripDetails) => {
    setTripDetails(data);
    navigate('/app');
  };

  return (
    <div>
      <PageHeader
        title="Trip Setup"
        subtitle="Enter your travel details to personalize your experience."
      />

      <div className="px-4 lg:px-12 flex justify-center lg:block">
        <FormCard as="form" onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[803px]">
          <div className="flex flex-col gap-[45px]">
            {/* Row 1: Departure Country & Destination Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[65px]">
              <FormField label="Departure Country" icon={<MapPin size={24} />}>
                <Controller
                  name="departureCountry"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CountrySelect
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. Colombia"
                    />
                  )}
                />
              </FormField>

              <FormField label="Destination Country" icon={<MapPin size={24} />}>
                <Controller
                  name="destinationCountry"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CountrySelect
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. Japan"
                    />
                  )}
                />
              </FormField>
            </div>

            {/* Row 2: Departure Date & Arrival Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[65px]">
              <FormField label="Departure Date" icon={<CalendarDays size={24} />}>
                <input
                  type="date"
                  {...register('departureDate')}
                  required
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
                />
              </FormField>

              <FormField label="Arrival Date" icon={<CalendarDays size={24} />}>
                <input
                  type="date"
                  {...register('arrivalDate')}
                  required
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
                />
              </FormField>
            </div>

            {/* Submit Button */}
            <SubmitButton icon={<CheckCircle size={24} />}>
              Save Trip Details
            </SubmitButton>
          </div>
        </FormCard>
      </div>
    </div>
  );
}
