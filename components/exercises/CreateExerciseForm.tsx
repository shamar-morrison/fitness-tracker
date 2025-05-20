'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useExercises } from '@/hooks/useExercises';
import type { Exercise } from '@/lib/supabase/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  type ControllerRenderProps,
  type FieldErrors,
  type SubmitHandler,
} from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const exerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters.' }),
  category: z
    .string()
    .trim()
    .min(2, { message: 'Category must be at least 2 characters.' }),
  description: z.string().optional(),
  target_muscle_groups: z.string().optional(), // Input as comma-separated string
});

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;

interface CreateExerciseFormProps {
  onExerciseCreated?: (newExercise: Exercise) => void;
  setOpen?: (open: boolean) => void;
}

export function CreateExerciseForm({
  onExerciseCreated,
  setOpen,
}: CreateExerciseFormProps) {
  const { createExercise, createLoading } = useExercises();

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      target_muscle_groups: '',
    },
  });

  const onValidSubmit: SubmitHandler<ExerciseFormValues> = async (
    data: ExerciseFormValues,
  ) => {
    const muscleGroupsArray = data.target_muscle_groups
      ? data.target_muscle_groups
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s)
      : [];

    const newExerciseData = {
      name: data.name,
      category: data.category,
      description: data.description || null,
      target_muscle_groups:
        muscleGroupsArray.length > 0 ? muscleGroupsArray : null,
    };

    const newExercise = await createExercise(newExerciseData);

    if (newExercise) {
      toast.success('Exercise Created', {
        description: `${newExercise.name} has been added to your exercises.`,
      });
      form.reset();
      if (onExerciseCreated) {
        onExerciseCreated(newExercise);
      }
      if (setOpen) {
        setOpen(false);
      }
    } else {
      toast.error('Error Creating Exercise', {
        description:
          'Failed to create exercise. Please ensure all required fields are correctly filled and try again.',
      });
    }
  };

  const onInvalidSubmit = async (errors: FieldErrors<ExerciseFormValues>) => {
    toast.error('Invalid Form Data', {
      description:
        'Please correct the errors highlighted below before submitting.',
    });
  };

  const handleCreateExerciseClick = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    const submitFn = form.handleSubmit(onValidSubmit, onInvalidSubmit);
    submitFn(e).catch((error) => {
      console.error('Error during programmatic form submission:', error);
      toast.error('Submission Error', {
        description:
          'An unexpected error occurred while trying to submit the form.',
      });
    });
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({
            field,
          }: {
            field: ControllerRenderProps<ExerciseFormValues, 'name'>;
          }) => (
            <FormItem>
              <FormLabel>Exercise Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Bench Press, Morning Run"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({
            field,
          }: {
            field: ControllerRenderProps<ExerciseFormValues, 'category'>;
          }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Chest, Cardio, Legs" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({
            field,
          }: {
            field: ControllerRenderProps<ExerciseFormValues, 'description'>;
          }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Briefly describe the exercise"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_muscle_groups"
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              ExerciseFormValues,
              'target_muscle_groups'
            >;
          }) => (
            <FormItem>
              <FormLabel>
                Target Muscle Groups (Optional, comma-separated)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Pectorals, Deltoids, Triceps"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter muscle groups separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="button"
          onClick={handleCreateExerciseClick}
          disabled={createLoading || form.formState.isSubmitting}
        >
          {createLoading || form.formState.isSubmitting
            ? 'Creating...'
            : 'Create Exercise'}
        </Button>
      </div>
    </Form>
  );
}
