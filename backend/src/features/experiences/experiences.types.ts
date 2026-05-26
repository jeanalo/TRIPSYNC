export interface Experience {
  id: string;
  name: string;
  country: string;
  location: string;
  category: string;
  image: string;
  duration: string;
  difficulty: string;
  description: string;
  eco: string;
  highlights: { icon: string; text: string }[];
  included: string[];
  tips: string[];
}

export interface CreateExperienceRequest {
  name: string;
  country: string;
  location: string;
  category: string;
  image: string;
  duration: string;
  difficulty: string;
  description: string;
  eco: string;
  highlights: { icon: string; text: string }[];
  included: string[];
  tips: string[];
}
