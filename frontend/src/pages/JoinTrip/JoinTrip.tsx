import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plane, MapPin, CalendarDays } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { getInviteInfo, joinTrip, type TripInviteInfo } from '../../services/invites.service';
import Spinner from '../../components/Spinner/Spinner';
import SubmitButton from '../../components/SubmitButton/SubmitButton';

type PageState = 'loading' | 'ready' | 'joining' | 'error';

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
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const token = params.get('token') ?? '';

  const [tripInfo, setTripInfo] = useState<TripInviteInfo | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  async function loadInviteTripInfo() {
    try {
      const data = await getInviteInfo(token);
      setTripInfo(data);
      setPageState('ready');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid or expired invite link.');
      setPageState('error');
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/join-trip?token=${token}`)}`, { replace: true });
      return;
    }
    if (!token) return;
    loadInviteTripInfo();
  }, [user, authLoading, navigate, token]);

  const handleJoin = async () => {
    if (!token) return;
    setPageState('joining');
    try {
      const tripId = await joinTrip(token);
      navigate(`/app?joined=${tripId}`, { replace: true });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not join trip.');
      setPageState('error');
    }
  };

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
