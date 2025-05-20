"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { ExerciseSelectDropdown } from "@/components/exercises/ExerciseSelectDropdown"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/useAuth"
import { useTemplates } from "@/hooks/useTemplates"
import { useWorkouts } from "@/hooks/useWorkouts"
import type { TemplateExercise, WorkoutUpdate } from "@/lib/supabase/types"
import { formatDateForInput } from "@/lib/utils/date-utils"

const workoutSchema = z.object({
  date: z.string().min(1, "Date is required."),
  exercise: z.string().trim().min(1, "Exercise is required."),
  sets: z.coerce.number().min(1, "Sets must be at least 1."),
  reps: z.coerce.number().min(1, "Reps must be at least 1."),
  weight: z.coerce.number().min(0, "Weight cannot be negative."),
  notes: z.string(),
})

export type WorkoutFormValues = z.infer<typeof workoutSchema>

interface WorkoutFormProps {
  workout?: WorkoutUpdate & { id: string }
  onSuccess?: () => void
}

export function WorkoutForm({ workout, onSuccess }: WorkoutFormProps) {
  const { user } = useAuth()
  const { createWorkout, updateWorkout, loading: submissionLoading, error: submissionApiError } = useWorkouts()
  const { getTemplate } = useTemplates()
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      date: workout?.date || formatDateForInput(new Date()),
      exercise: workout?.exercise || "",
      sets: workout?.sets || 3,
      reps: workout?.reps || 10,
      weight: workout?.weight || 0,
      notes: workout?.notes || "",
    },
  })

  const [templateLoading, setTemplateLoading] = useState(false)

  useEffect(() => {
    const loadTemplate = async () => {
      if (templateId && user && !workout?.id) {
        setTemplateLoading(true)
        try {
          const template = await getTemplate(templateId)
          if (template) {
            const exercises = template.exercises as unknown as TemplateExercise[]
            if (exercises && exercises.length > 0) {
              const firstExercise = exercises[0]
              form.reset({
                date: form.getValues("date"),
                exercise: firstExercise.exercise,
                sets: firstExercise.sets,
                reps: firstExercise.reps,
                weight: firstExercise.weight,
                notes: firstExercise.notes || "",
              })
            }
          }
        } catch (e) {
          console.error("Failed to load template:", e)
          toast.error("Failed to load template", { description: e instanceof Error ? e.message : "Unknown error" })
        } finally {
          setTemplateLoading(false)
        }
      }
    }

    if (!form.formState.isDirty || !workout?.id) {
      loadTemplate()
    }
  }, [templateId, user, getTemplate, form, workout?.id])

  const processSubmit = async (data: WorkoutFormValues) => {
    if (!user) {
      toast.error("You must be logged in to save a workout.")
      return
    }

    try {
      let result
      if (workout?.id) {
        result = await updateWorkout(workout.id, data)
      } else {
        result = await createWorkout({
          ...data,
          user_id: user.id,
        })
      }

      if (!result) {
        throw new Error(workout?.id ? "Failed to update workout." : "Failed to create workout.")
      }
      
      toast.success(workout?.id ? "Workout Updated!" : "Workout Added!", {
        description: `Your workout for ${data.exercise} on ${data.date} has been saved.`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/workouts")
        router.refresh()
      }
    } catch (err) {
      console.error("Error saving workout:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      toast.error("Error Saving Workout", { description: errorMessage })
    }
  }

  if (templateLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{workout ? "Edit Workout" : "Add Workout"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-0">
          <CardContent className="space-y-4">
            {submissionApiError && (
              <Alert variant="destructive">
                <AlertDescription>{submissionApiError}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exercise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise</FormLabel>
                  <FormControl>
                    <ExerciseSelectDropdown
                      selectedExerciseName={field.value}
                      onExerciseSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="sets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sets</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reps</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (lbs)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this workout..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={submissionLoading || form.formState.isSubmitting}>
              {submissionLoading || form.formState.isSubmitting
                ? "Saving..."
                : workout
                ? "Update Workout"
                : "Add Workout"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
