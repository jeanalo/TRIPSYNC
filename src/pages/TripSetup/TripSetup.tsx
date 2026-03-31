import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTravel, TripDetails } from '../../context/TravelContext';

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
    <div>
      <h1>Trip Setup</h1>
      <p>Enter your travel details to personalize your experience.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Departure Country</label>
          <input
            {...register('departureCountry')}
            placeholder="e.g. Colombia"
            required
          />
        </div>

        <div>
          <label>Destination Country</label>
          <input
            {...register('destinationCountry')}
            placeholder="e.g. Japan"
            required
          />
        </div>

        <div>
          <label>Departure Date</label>
          <input
            type="date"
            {...register('departureDate')}
            required
          />
        </div>

        <div>
          <label>Arrival Date</label>
          <input
            type="date"
            {...register('arrivalDate')}
            required
          />
        </div>

        <div>
          <label>Total Budget</label>
          <input
            type="number"
            {...register('budget')}
            placeholder="5000"
            required
          />
        </div>

        <button type="submit">Save Trip Details</button>
      </form>
    </div>
  );
}