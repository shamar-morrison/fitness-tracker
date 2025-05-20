'use client';

import { Button } from '@/components/ui/button';
import { WorkoutForm } from '@/components/workouts/WorkoutForm';
import { useAuth } from '@/hooks/useAuth';
import { useWorkouts } from '@/hooks/useWorkouts';
import type { WorkoutUpdate } from '@/lib/supabase/types';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditWorkoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getWorkout, loading } = useWorkouts();
  const [workout, setWorkout] = useState< (WorkoutUpdate & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!user || !id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getWorkout(id as string);
        setWorkout(data as any);
      } catch (err) {
        console.error('Error fetching workout:', err);
        setError('Failed to load workout data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkout();
  }, [user, id, getWorkout]);

  if (isLoading || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Error</h1>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Workout Not Found</h1>
        </div>
        <p>
          The workout you are looking for does not exist or you don&apos;t have
          permission to view it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Workout</h1>
      </div>
      <WorkoutForm workout={workout} />
    </div>
  );
}
