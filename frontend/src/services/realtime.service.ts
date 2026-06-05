import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { RealtimeRecommendationPayload } from '@/types/realtime.types';

class RealtimeService {
  private channel: RealtimeChannel | null = null;
  private tripChannel: RealtimeChannel | null = null;
  private currentTripId: string | null = null;
  private tripCallbacks: Set<() => void> = new Set();

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
    if (this.currentTripId !== tripId) {
      this._teardownTripChannel();
      this.currentTripId = tripId;
    }

    this.tripCallbacks.add(onChanged);

    if (!this.tripChannel) {
      this.tripChannel = supabase
        .channel(`trip:${tripId}`)
        .on('broadcast', { event: 'trip-changed' }, () => {
          this.tripCallbacks.forEach((cb) => cb());
        })
        .subscribe();
    }

    return () => {
      this.tripCallbacks.delete(onChanged);
      if (this.tripCallbacks.size === 0) {
        this._teardownTripChannel();
      }
    };
  }

  private _teardownTripChannel(): void {
    if (this.tripChannel) {
      supabase.removeChannel(this.tripChannel);
      this.tripChannel = null;
    }
    this.currentTripId = null;
    this.tripCallbacks.clear();
  }
}

export const realtimeService = new RealtimeService();
