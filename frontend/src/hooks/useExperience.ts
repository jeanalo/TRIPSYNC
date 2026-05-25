import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import type { Experience } from '../data/types';

export const useExperiences = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
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

  useEffect(() => {
    if (!user?.id) {
      setSavedIds(new Set());
      return;
    }

    const fetchSaved = async () => {
      const { data, error } = await supabase
        .from('saved_experiences')
        .select('experience_id')
        .eq('user_id', user.id);

      if (!error && data) {
        setSavedIds(new Set(data.map((row) => row.experience_id as number)));
      }
    };

    fetchSaved();
  }, [user?.id]);

  const toggleSave = useCallback(
    async (experienceId: number) => {
      if (!user?.id) return;

      const isSaved = savedIds.has(experienceId);

      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (isSaved) next.delete(experienceId);
        else next.add(experienceId);
        return next;
      });

      if (isSaved) {
        const { error } = await supabase
          .from('saved_experiences')
          .delete()
          .eq('user_id', user.id)
          .eq('experience_id', experienceId);

        if (error) {
          console.error(error);
          // Revert on error
          setSavedIds((prev) => {
            const next = new Set(prev);
            next.add(experienceId);
            return next;
          });
        }
      } else {
        const { error } = await supabase.from('saved_experiences').insert({
          user_id: user.id,
          experience_id: experienceId,
        });

        if (error) {
          console.error(error);
          // Revert on error
          setSavedIds((prev) => {
            const next = new Set(prev);
            next.delete(experienceId);
            return next;
          });
        }
      }
    },
    [user?.id, savedIds]
  );

  return { experiences, savedIds, toggleSave, loading };
};
