import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTravel, TripDetails } from '../../context/TravelContext';
import { MapPin, CalendarDays, CheckCircle } from 'lucide-react'; //Icons Library
import { motion } from 'motion/react'; //Animations Library

export default function TripSetup() {
  const { tripDetails, setTripDetails } = useTravel();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<TripDetails>({
    defaultValues: tripDetails,
  });

  const onSubmit = (data: TripDetails) => {
    setTripDetails(data);
    navigate('/app');
  };

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
          Trip Setup
        </h1>
        <p className="text-[16px] leading-[24px] text-[#0066D2]">
          Enter your travel details to personalize your experience.
        </p>
      </div>

      {/* Form Card */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[803px] rounded-[15px] border-2 border-[#6cd9ce] bg-[rgba(108,217,206,0.25)] px-[44px] py-[42px]"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex flex-col gap-[45px]">
          {/* Row 1: Departure Country & Destination Country */}
          <div className="grid grid-cols-2 gap-[65px]">
            {/* Departure Country */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[20px] font-semibold leading-[36px] text-[#1CA698]">
                Departure Country
              </label>
              <div className="flex h-[52px] items-center gap-5 rounded-[15px] border border-[#1CA698] bg-white pl-5 pr-6">
                <MapPin size={24} className="shrink-0 text-[#1CA698]" />
                <input
                  {...register('departureCountry')}
                  placeholder="e.g. Cali, Colombia"
                  required
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] placeholder-[#1CA698]/50 outline-none"
                />
              </div>
            </div>

            {/* Destination Country */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[20px] font-semibold leading-[36px] text-[#1CA698]">
                Destination Country
              </label>
              <div className="flex h-[52px] items-center gap-5 rounded-[15px] border border-[#1CA698] bg-white pl-5 pr-6">
                <MapPin size={24} className="shrink-0 text-[#1CA698]" />
                <input
                  {...register('destinationCountry')}
                  placeholder="e.g. Tokio, Japan"
                  required
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] placeholder-[#1CA698]/50 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Departure Date & Arrival Date */}
          <div className="grid grid-cols-2 gap-[65px]">
            {/* Departure Date */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[20px] font-semibold leading-[36px] text-[#1CA698]">
                Departure Date
              </label>
              <div className="flex h-[52px] items-center gap-5 rounded-[15px] border border-[#1CA698] bg-white pl-5 pr-6">
                <CalendarDays size={24} className="shrink-0 text-[#1CA698]" />
                <input
                  type="date"
                  {...register('departureDate')}
                  required
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
                />
              </div>
            </div>

            {/* Arrival Date */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[20px] font-semibold leading-[36px] text-[#1CA698]">
                Arrival Date
              </label>
              <div className="flex h-[52px] items-center gap-5 rounded-[15px] border border-[#1CA698] bg-white pl-5 pr-6">
                <CalendarDays size={24} className="shrink-0 text-[#1CA698]" />
                <input
                  type="date"
                  {...register('arrivalDate')}
                  required
                  className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="flex h-[52px] w-full cursor-pointer items-center justify-center gap-1 rounded-[15px] border-none bg-[#0066D2] text-[18px] font-semibold leading-[24px] text-[#F5F5F5] transition-all duration-300 hover:bg-[#0055b0] hover:shadow-lg active:scale-[0.98]"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle size={24} />
            <span>Save Trip Details</span>
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}