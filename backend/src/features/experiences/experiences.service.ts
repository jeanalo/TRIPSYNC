import { supabase } from '../../config/supabase';
import { Experience, CreateExperienceRequest } from './experiences.types';

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
  return data as Experience;
};
