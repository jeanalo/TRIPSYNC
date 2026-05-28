import { supabase } from '../../config/supabase';
import { Experience, CreateExperienceRequest } from './experiences.types';

const broadcastNewExperience = async (experience: Experience): Promise<void> => {
  const channel = supabase.channel(`recommendations:${experience.country.toLowerCase().trim()}`);
  await channel.httpSend('new-recommendation', {
    id: experience.id,
    country: experience.country,
    category: experience.category,
    name: experience.name,
    location: experience.location,
    description: experience.description,
    imageUrl: experience.image,
  });
  supabase.removeChannel(channel);
};

export const getExperiencesService = async (): Promise<Experience[]> => {
  const { data, error } = await supabase.from('experiences').select('*');
  if (error) throw error;
  return data as Experience[];
};

export const createExperienceService = async (payload: CreateExperienceRequest): Promise<Experience> => {
  const { data, error } = await supabase
    .from('experiences')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  const experience = data as Experience;
  broadcastNewExperience(experience);
  return experience;
};
