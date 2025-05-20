'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategorizedExercise, useExercises } from '@/hooks/useExercises';
import type { Exercise } from '@/lib/supabase/types';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { CreateExerciseForm } from './CreateExerciseForm'; // Import the form

interface ExerciseSelectDropdownProps {
  onExerciseSelect: (exerciseName: string) => void; // We pass the name, as current DB schema uses string
  selectedExerciseName?: string | null;
}

export function ExerciseSelectDropdown({
  onExerciseSelect,
  selectedExerciseName,
}: ExerciseSelectDropdownProps) {
  const { categorizedExercises, fetchLoading, error, refetchExercises } =
    useExercises();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleExerciseCreated = async (newExercise: Exercise) => {
    await refetchExercises();
    onExerciseSelect(newExercise.name);
    setShowCreateForm(false);
  };

  if (fetchLoading) return <p>Loading exercises...</p>;
  if (error) return <p>Error loading exercises: {error}</p>;

  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={(value) => {
          if (value === '__CREATE_NEW__') {
            // Handled by DialogTrigger
          } else {
            onExerciseSelect(value);
          }
        }}
        value={selectedExerciseName || undefined}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select an exercise" />
        </SelectTrigger>
        <SelectContent>
          {categorizedExercises.map((categoryGroup: CategorizedExercise) => (
            <SelectGroup key={categoryGroup.category}>
              <SelectLabel>{categoryGroup.category}</SelectLabel>
              {categoryGroup.exercises.map((exercise: Exercise) => (
                <SelectItem key={exercise.id} value={exercise.name}>
                  {exercise.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" title="Create new exercise">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Exercise</DialogTitle>
          </DialogHeader>
          <CreateExerciseForm
            onExerciseCreated={handleExerciseCreated}
            setOpen={setShowCreateForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
