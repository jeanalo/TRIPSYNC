import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { getInviteInfo, joinTrip } from '../services/invites.service';
import type { TripInviteInfo } from '../services/invites.service';

type PageState = 'loading' | 'ready' | 'joining' | 'error';

export function useJoinTrip() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const token = params.get('token') ?? '';

  const [tripInfo, setTripInfo] = useState<TripInviteInfo | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/join-trip?token=${token}`)}`, { replace: true });
      return;
    }
    if (!token) return;
    getInviteInfo(token)
      .then((data) => {
        setTripInfo(data);
        setPageState('ready');
      })
      .catch((err: unknown) => {
        setErrorMsg(err instanceof Error ? err.message : 'Invalid or expired invite link.');
        setPageState('error');
      });
  }, [user, authLoading, token]);

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

  return { tripInfo, pageState, errorMsg, authLoading, user, handleJoin };
}
