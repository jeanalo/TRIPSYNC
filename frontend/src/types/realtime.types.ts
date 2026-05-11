export interface RealtimeRecommendationPayload {
  id: string;
  country: string;
  category: string;
  activityName: string;
  location: string;
  date: string;
  time: string;
  details?: string;
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
