export interface RealtimeRecommendationPayload {
  id: string;
  city: string;
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
  city: string;
  payload: RealtimeRecommendationPayload;
  timestamp: string;
}

export interface CityRoomPayload {
  city: string;
}
