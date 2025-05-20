'use client';

import { supabaseClient } from '@/lib/supabase/client';
import type { Metric, MetricInsert, MetricUpdate } from '@/lib/supabase/types';
import { useCallback, useState } from 'react';

export function useMetrics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMetrics = useCallback(
    async (userId: string, startDate?: string, endDate?: string) => {
      setLoading(true);
      setError(null);

      try {
        let query = supabaseClient
          .from('metrics')
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

        return data as Metric[];
      } catch (err: any) {
        setError(err.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getMetric = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient
        .from('metrics')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as Metric;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMetric = useCallback(async (metric: MetricInsert) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient
        .from('metrics')
        .insert(metric)
        .select()
        .single();

      if (error) throw error;

      return data as Metric;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMetric = useCallback(async (id: string, metric: MetricUpdate) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient
        .from('metrics')
        .update(metric)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as Metric;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMetric = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabaseClient
        .from('metrics')
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

  const uploadPhoto = useCallback(async (file: File, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `progress-photos/${fileName}`;

      const { error: uploadError } = await supabaseClient.storage
        .from('metrics')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabaseClient.storage
        .from('metrics')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getMetrics,
    getMetric,
    createMetric,
    updateMetric,
    deleteMetric,
    uploadPhoto,
  };
}
