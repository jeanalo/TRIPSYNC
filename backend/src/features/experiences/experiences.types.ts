export interface Experience {
  id: string;
  title: string;
  location: string;
  category: string;
  description?: string;
  country?: string;
  city?: string;
  price?: number;
  imageUrl?: string;
}

export interface CreateExperienceRequest {
  title: string;
  description: string;
  country: string;
  city: string;
  price: number;
  category: string;
  imageUrl: string;
}
