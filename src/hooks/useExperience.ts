import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Experience } from '../data/types';

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { data, error } = await supabase.from('experiences').select('*');

      if (error) {
        console.error(error);
      } else {
        setExperiences(data || []);
      }

      setLoading(false);
    };

    fetchExperiences();
  }, []);

  return { experiences, loading };
};
