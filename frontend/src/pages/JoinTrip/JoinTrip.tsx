import { Plane, MapPin, CalendarDays } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useJoinTrip } from '../../hooks/useJoinTrip';
import Spinner from '../../components/Spinner/Spinner';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import { useNavigate } from 'react-router-dom';

const TripInfoRow = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <Icon size={16} className="text-[#0066D2] shrink-0" />
    <div>
      <p className="text-[11px] text-[#0066D2]/50 uppercase tracking-wide">{label}</p>
      <p className="text-[15px] font-semibold text-[#0066D2]">{value}</p>
    </div>
  </div>
);

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const JoinTrip = () => {
  const navigate = useNavigate();
  const { tripInfo, pageState, errorMsg, authLoading, user, handleJoin } = useJoinTrip();

  if (authLoading || (pageState === 'loading' && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f6ff]">
        <Spinner />
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f6ff] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center">
          <p className="text-[16px] font-semibold text-red-500">{errorMsg}</p>
          <div className="mt-6 w-full">
            <SubmitButton type="button" onClick={() => navigate('/app')}>
              Go to dashboard
            </SubmitButton>
          </div>
        </div>
      </div>
    );
  }

  if (!tripInfo) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f6ff] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0066D2]/10">
            <Plane size={26} className="text-[#0066D2]" />
          </div>

          <div className="text-center">
            <h1 className="text-[22px] font-bold text-[#0066D2]">You're invited!</h1>
            <p className="mt-1 text-[14px] text-[#0066D2]/60">
              Join this trip and start planning together.
            </p>
          </div>

          <div className="w-full rounded-xl border border-[#0066D2]/15 bg-[#f0f6ff] p-4 flex flex-col gap-3">
            <TripInfoRow icon={MapPin} label="Destination" value={tripInfo.destination_country} />
            <TripInfoRow
              icon={CalendarDays}
              label="Dates"
              value={`${formatDate(tripInfo.departure_date)} – ${formatDate(tripInfo.arrival_date)}`}
            />
          </div>

          <SubmitButton
            type="button"
            onClick={handleJoin}
            loading={pageState === 'joining'}
            loadingText="Joining..."
          >
            Join trip
          </SubmitButton>

          <button
            onClick={() => navigate('/app')}
            className="text-[13px] text-[#0066D2]/50 hover:text-[#0066D2] transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinTrip;
