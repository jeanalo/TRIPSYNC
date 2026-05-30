export interface RealtimeRecommendationPayload {
  id: string;
  country: string;
  category: string;
  name: string;
  location: string;
  description?: string;
  imageUrl?: string;
}

export interface RecommendationNotification {
  id: string;
  type: 'new-recommendation';
  country: string;
  payload: RealtimeRecommendationPayload;
  timestamp: string;
}

export interface CountryRoomPayload {
  country: string;
}
