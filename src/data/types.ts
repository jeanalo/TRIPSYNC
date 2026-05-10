export type ExperienceCategory = 'Chill' | 'Adventure' | 'Cultural' | 'Free Tour';

export type Difficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface Highlight {
  icon: string;
  text: string;
}

export interface Experience {
  id: number;
  country: string;
  name: string;
  location: string;
  category: ExperienceCategory;
  image: string;
  duration: string;
  difficulty: Difficulty;
  description: string;
  highlights: Highlight[];
  included: string[];
  tips: string[];
  eco: string;
}
