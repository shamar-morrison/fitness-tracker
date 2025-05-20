"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useExercises } from "@/hooks/useExercises"
import type { Exercise } from "@/lib/supabase/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const exerciseSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  category: z.string().min(2, { message: "Category must be at least 2 characters." }),
  description: z.string().optional(),
  target_muscle_groups: z.string().optional(), // Input as comma-separated string
})

export type ExerciseFormValues = z.infer<typeof exerciseSchema>

interface CreateExerciseFormProps {
  onExerciseCreated?: (newExercise: Exercise) => void
  setOpen?: (open: boolean) => void
}

export function CreateExerciseForm({ onExerciseCreated, setOpen }: CreateExerciseFormProps) {
  const { createExercise, loading: creatingExercise } = useExercises()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
  })

  const onSubmit: SubmitHandler<ExerciseFormValues> = async (data: ExerciseFormValues) => {
    const muscleGroupsArray = data.target_muscle_groups
      ? data.target_muscle_groups.split(",").map((s: string) => s.trim()).filter((s: string) => s)
      : []

    const newExercise = await createExercise({
      name: data.name,
      category: data.category,
      description: data.description || null,
      target_muscle_groups: muscleGroupsArray.length > 0 ? muscleGroupsArray : null,
    })

    if (newExercise) {
      toast.success("Exercise Created", {
        description: `${newExercise.name} has been added to your exercises.`,
      })
      reset()
      if (onExerciseCreated) {
        onExerciseCreated(newExercise)
      }
      if (setOpen) {
        setOpen(false) // Close dialog if setOpen is provided
      }
    } else {
      toast.error("Error", {
        description: "Failed to create exercise. Please try again.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Exercise Name</Label>
        <Input id="name" {...register("name")} placeholder="e.g., Bench Press, Morning Run" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" {...register("category")} placeholder="e.g., Chest, Cardio, Legs" />
        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea id="description" {...register("description")} placeholder="Briefly describe the exercise" />
      </div>

      <div>
        <Label htmlFor="target_muscle_groups">Target Muscle Groups (Optional, comma-separated)</Label>
        <Input id="target_muscle_groups" {...register("target_muscle_groups")} placeholder="e.g., Pectorals, Deltoids, Triceps" />
      </div>

      <Button type="submit" disabled={creatingExercise}>
        {creatingExercise ? "Creating..." : "Create Exercise"}
      </Button>
    </form>
  )
} 