'use client';

import { supabaseClient } from '@/lib/supabase/client';
import type {
  Workout,
  WorkoutInsert,
  WorkoutUpdate,
} from '@/lib/supabase/types';
import { useCallback, useState } from 'react';

export function useWorkouts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWorkouts = useCallback(
    async (userId: string, startDate?: string, endDate?: string) => {
      setLoading(true);
      setError(null);

      try {
        let query = supabaseClient
          .from('workouts')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (startDate) {
          query = query.gte('date', startDate);
        }

        if (endDate) {
          query = query.lte('date', endDate);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data as Workout[];
      } catch (err: any) {
        setError(err.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getWorkout = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as Workout;
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching workout:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkout = useCallback(async (workout: WorkoutInsert) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient
        .from('workouts')
        .insert(workout)
        .select()
        .single();

      if (error) throw error;

      return data as Workout;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWorkout = useCallback(
    async (id: string, workout: WorkoutUpdate) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabaseClient
          .from('workouts')
          .update(workout)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return data as Workout;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteWorkout = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabaseClient
        .from('workouts')
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
    getWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
  };
}
