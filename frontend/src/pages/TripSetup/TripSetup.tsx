import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTrip } from '../../context/TripProvider';
import type { TripDetails } from '../../types/travel.types';
import { MapPin, CalendarDays, CheckCircle } from 'lucide-react';

import PageHeader from '../../components/PageHeader/PageHeader';
import FormCard from '../../components/FormCard/FormCard';
import FormField from '../../components/FormField/FormField';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import CountrySelect from '../../components/CountrySelect/CountrySelect';

export default function TripSetup() {
  const { tripDetails, setTripDetails } = useTrip();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TripDetails>({ defaultValues: tripDetails });

  useEffect(() => {
    reset(tripDetails);
  }, [tripDetails, reset]);

  const onSubmit = async (data: TripDetails) => {
    try {
      setTripDetails(data);
      toast.success('Trip details saved!');
      navigate('/app');
    } catch {
      toast.error('Failed to save trip details. Please try again.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Trip Setup"
        subtitle="Enter your travel details to personalize your experience."
      />

      <div className="px-4 lg:px-12 flex justify-center lg:block">
        <FormCard
          as="form"
          onSubmit={() => { void handleSubmit(onSubmit)(); }}
          className="w-full max-w-[803px]"
        >
          <div className="flex flex-col gap-[45px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[65px]">
              <FormField
                label="Departure Country"
                icon={<MapPin size={24} />}
                error={errors.departureCountry ? 'Departure country is required' : undefined}
              >
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

              <FormField
                label="Destination Country"
                icon={<MapPin size={24} />}
                error={errors.destinationCountry ? 'Destination country is required' : undefined}
              >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[65px]">
              <FormField
                label="Departure Date"
                icon={<CalendarDays size={24} />}
                error={errors.departureDate ? 'Departure date is required' : undefined}
              >
                <input
                  type="date"
                  {...register('departureDate', { required: true })}
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
                />
              </FormField>

              <FormField
                label="Arrival Date"
                icon={<CalendarDays size={24} />}
                error={errors.arrivalDate ? 'Arrival date is required' : undefined}
              >
                <input
                  type="date"
                  {...register('arrivalDate', { required: true })}
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
                />
              </FormField>
            </div>

            <SubmitButton
              icon={<CheckCircle size={24} />}
              loading={isSubmitting}
              loadingText="Saving..."
            >
              Save Trip Details
            </SubmitButton>
          </div>
        </FormCard>
      </div>
    </div>
  );
}
