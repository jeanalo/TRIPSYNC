import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { RealtimeRecommendationPayload } from '@/types/realtime.types';

class RealtimeService {
  private channel: RealtimeChannel | null = null;

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

  public sendRecommendation(country: string, recommendation: RealtimeRecommendationPayload): void {
    const channel = supabase.channel(`recommendations:${country.toLowerCase().trim()}`);
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.send({
          type: 'broadcast',
          event: 'new-recommendation',
          payload: recommendation,
        }).then(() => {
          supabase.removeChannel(channel);
        });
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        supabase.removeChannel(channel);
      }
    });
  }
}

export const realtimeService = new RealtimeService();
