import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { RealtimeRecommendationPayload } from '@/types/realtime.types';

class RealtimeService {
  private channel: RealtimeChannel | null = null;
  private tripChannel: RealtimeChannel | null = null;

  public subscribe(
    country: string,
    onRecommendation: (r: RealtimeRecommendationPayload) => void
  ): () => void {
    this.unsubscribe();

    this.channel = supabase
      .channel(`recommendations:${country.toLowerCase().trim()}`)
      .on('broadcast', { event: 'new-recommendation' }, ({ payload }) => {
        onRecommendation(payload as RealtimeRecommendationPayload);
      })
      .subscribe();

    return () => this.unsubscribe();
  }

  public unsubscribe(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  public subscribeToTrip(tripId: string, onChanged: () => void): () => void {
    this.unsubscribeFromTrip();

    this.tripChannel = supabase
      .channel(`trip:${tripId}`)
      .on('broadcast', { event: 'trip-changed' }, () => {
        onChanged();
      })
      .subscribe();

    return () => this.unsubscribeFromTrip();
  }

  public unsubscribeFromTrip(): void {
    if (this.tripChannel) {
      supabase.removeChannel(this.tripChannel);
      this.tripChannel = null;
    }
  }
}

export const realtimeService = new RealtimeService();
