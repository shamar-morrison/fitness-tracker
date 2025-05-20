'use client';

import type React from 'react';

import { ExerciseSelectDropdown } from '@/components/exercises/ExerciseSelectDropdown';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useTemplates } from '@/hooks/useTemplates';
import type {
    Json,
    TemplateExercise,
    WorkoutTemplateInsert,
    WorkoutTemplateUpdate,
} from '@/lib/supabase/types';
import { Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TemplateFormProps {
  template?: WorkoutTemplateUpdate & {
    id: string;
    exercises: TemplateExercise[];
  };
  onSuccess?: () => void;
}

interface TemplateFormData {
  name: string;
  description: string | null;
  exercises: TemplateExercise[];
  user_id?: string;
}

export function TemplateForm({ template, onSuccess }: TemplateFormProps) {
  const { user } = useAuth();
  const { createTemplate, updateTemplate, loading, error } = useTemplates();
  const router = useRouter();

  const [formData, setFormData] = useState<TemplateFormData>({
    name: template?.name || '',
    description: template?.description || null,
    exercises: template?.exercises || [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExerciseChange = (
    index: number,
    field: keyof TemplateExercise,
    value: string | number,
  ) => {
    const exercises = [...formData.exercises];
    exercises[index] = {
      ...exercises[index],
      [field]:
        field === 'exercise' || field === 'notes' ? value : Number(value),
    };
    setFormData((prev) => ({
      ...prev,
      exercises,
    }));
  };

  const addExercise = () => {
    const exercises = [...formData.exercises];
    exercises.push({
      exercise: '',
      sets: 3,
      reps: 10,
      weight: 0,
      notes: '',
    });
    setFormData((prev) => ({
      ...prev,
      exercises,
    }));
  };

  const removeExercise = (index: number) => {
    const exercises = [...formData.exercises];
    exercises.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      exercises,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const submissionData: WorkoutTemplateInsert | WorkoutTemplateUpdate = {
      name: formData.name,
      description: formData.description,
      exercises: formData.exercises as unknown as Json,
    };

    try {
      if (template?.id) {
        await updateTemplate(
          template.id,
          submissionData as WorkoutTemplateUpdate,
        );
      } else {
        await createTemplate({
          ...(submissionData as WorkoutTemplateInsert),
          user_id: user.id,
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/templates');
        router.refresh();
      }
    } catch (err) {
      console.error('Error saving template:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template ? 'Edit Template' : 'Create Template'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Upper Body Workout, Leg Day, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Describe your workout template..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Exercises</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExercise}
              >
                <Plus className="mr-1 h-4 w-4" /> Add Exercise
              </Button>
            </div>

            {formData.exercises.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No exercises added yet. Click &quot;Add Exercise&quot; to begin.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.exercises.map((exercise, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`exercise-${index}`}>
                              Exercise Name
                            </Label>
                            <ExerciseSelectDropdown
                              selectedExerciseName={exercise.exercise}
                              onExerciseSelect={(selectedExerciseName) =>
                                handleExerciseChange(
                                  index,
                                  'exercise',
                                  selectedExerciseName,
                                )
                              }
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExercise(index)}
                          className="ml-2"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove exercise</span>
                        </Button>
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
          <Button type="submit" disabled={loading}>
            {loading
              ? 'Saving...'
              : template
                ? 'Update Template'
                : 'Create Template'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
