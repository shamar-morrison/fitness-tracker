'use client';

import { supabaseClient } from '@/lib/supabase/client';
import type {
  WorkoutTemplate,
  WorkoutTemplateInsert,
  WorkoutTemplateUpdate,
} from '@/lib/supabase/types';
import { useCallback, useState } from 'react';

export function useTemplates() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTemplates = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient
        .from('workout_templates')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (error) throw error;

      return data as WorkoutTemplate[];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getTemplate = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient
        .from('workout_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as WorkoutTemplate;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(
    async (template: WorkoutTemplateInsert) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabaseClient
          .from('workout_templates')
          .insert(template)
          .select()
          .single();

        if (error) throw error;

        return data as WorkoutTemplate;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateTemplate = useCallback(
    async (id: string, template: WorkoutTemplateUpdate) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabaseClient
          .from('workout_templates')
          .update(template)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return data as WorkoutTemplate;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteTemplate = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabaseClient
        .from('workout_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
