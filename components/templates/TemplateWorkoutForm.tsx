'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useTemplates } from '@/hooks/useTemplates';
import { useAuth } from '@/hooks/useAuth';
import type { WorkoutInsert, TemplateExercise } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDateForInput } from '@/lib/utils/date-utils';
import { Checkbox } from '@/components/ui/checkbox';

interface TemplateWorkoutFormProps {
  templateId: string;
  onSuccess?: () => void;
}

export function TemplateWorkoutForm({
  templateId,
  onSuccess,
}: TemplateWorkoutFormProps) {
  const { user } = useAuth();
  const {
    createWorkout,
    loading: workoutLoading,
    error: workoutError,
  } = useWorkouts();
  const {
    getTemplate,
    loading: templateLoading,
    error: templateError,
  } = useTemplates();
  const router = useRouter();

  const [date, setDate] = useState(formatDateForInput(new Date()));
  const [exercises, setExercises] = useState<
    (TemplateExercise & { selected: boolean })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadTemplate = async () => {
      if (templateId && user) {
        const template = await getTemplate(templateId);

        if (template) {
          const templateExercises = template.exercises as TemplateExercise[];
          setExercises(
            templateExercises.map((exercise) => ({
              ...exercise,
              selected: true,
            })),
          );
        }
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [templateId, user, getTemplate]);

  const handleExerciseChange = (
    index: number,
    field: keyof TemplateExercise,
    value: string | number,
  ) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]:
        field === 'exercise' || field === 'notes' ? value : Number(value),
    };
    setExercises(updatedExercises);
  };

  const toggleExerciseSelection = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      selected: !updatedExercises[index].selected,
    };
    setExercises(updatedExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      setSaving(true);
      setError(null);

      // Filter only selected exercises
      const selectedExercises = exercises.filter(
        (exercise) => exercise.selected,
      );

      if (selectedExercises.length === 0) {
        setError('Please select at least one exercise');
        setSaving(false);
        return;
      }

      // Create a workout for each selected exercise
      const promises = selectedExercises.map((exercise) => {
        const workoutData: WorkoutInsert = {
          user_id: user.id,
          date,
          exercise: exercise.exercise,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          notes: exercise.notes || null,
        };
        return createWorkout(workoutData);
      });

      await Promise.all(promises);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/workouts');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || templateLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Workout from Template</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {(error || workoutError || templateError) && (
            <Alert variant="destructive">
              <AlertDescription>
                {error || workoutError || templateError}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Exercises</Label>
            {exercises.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No exercises found in this template.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          id={`select-${index}`}
                          checked={exercise.selected}
                          onCheckedChange={() => toggleExerciseSelection(index)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`exercise-${index}`}>
                              Exercise Name
                            </Label>
                            <Input
                              id={`exercise-${index}`}
                              value={exercise.exercise}
                              onChange={(e) =>
                                handleExerciseChange(
                                  index,
                                  'exercise',
                                  e.target.value,
                                )
                              }
                              placeholder="e.g., Bench Press, Squat, etc."
                              required
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`sets-${index}`}>Sets</Label>
                              <Input
                                id={`sets-${index}`}
                                type="number"
                                min="1"
                                value={exercise.sets}
                                onChange={(e) =>
                                  handleExerciseChange(
                                    index,
                                    'sets',
                                    e.target.value,
                                  )
                                }
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`reps-${index}`}>Reps</Label>
                              <Input
                                id={`reps-${index}`}
                                type="number"
                                min="1"
                                value={exercise.reps}
                                onChange={(e) =>
                                  handleExerciseChange(
                                    index,
                                    'reps',
                                    e.target.value,
                                  )
                                }
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`weight-${index}`}>
                                Weight (lbs)
                              </Label>
                              <Input
                                id={`weight-${index}`}
                                type="number"
                                min="0"
                                step="0.5"
                                value={exercise.weight}
                                onChange={(e) =>
                                  handleExerciseChange(
                                    index,
                                    'weight',
                                    e.target.value,
                                  )
                                }
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`notes-${index}`}>Notes</Label>
                            <Textarea
                              id={`notes-${index}`}
                              value={exercise.notes || ''}
                              onChange={(e) =>
                                handleExerciseChange(
                                  index,
                                  'notes',
                                  e.target.value,
                                )
                              }
                              placeholder="Any additional notes about this exercise..."
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || workoutLoading}>
            {saving || workoutLoading ? 'Saving...' : 'Log Workout'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
