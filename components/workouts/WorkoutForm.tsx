"use client"

import type React from "react"

import { ExerciseSelectDropdown } from "@/components/exercises/ExerciseSelectDropdown"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/useAuth"
import { useTemplates } from "@/hooks/useTemplates"
import { useWorkouts } from "@/hooks/useWorkouts"
import type { TemplateExercise, WorkoutInsert, WorkoutUpdate } from "@/lib/supabase/types"
import { formatDateForInput } from "@/lib/utils/date-utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface WorkoutFormProps {
  workout?: WorkoutUpdate & { id: string }
  onSuccess?: () => void
}

export function WorkoutForm({ workout, onSuccess }: WorkoutFormProps) {
  const { user } = useAuth()
  const { createWorkout, updateWorkout, loading, error } = useWorkouts()
  const { getTemplate } = useTemplates()
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")

  const [formData, setFormData] = useState<Partial<WorkoutInsert>>({
    date: workout?.date || formatDateForInput(new Date()),
    exercise: workout?.exercise || "",
    sets: workout?.sets || 3,
    reps: workout?.reps || 10,
    weight: workout?.weight || 0,
    notes: workout?.notes || "",
  })

  const [templateLoading, setTemplateLoading] = useState(false)

  useEffect(() => {
    const loadTemplate = async () => {
      if (templateId && user) {
        setTemplateLoading(true)
        const template = await getTemplate(templateId)

        if (template) {
          // If it's a new workout from a template, we'll use the first exercise
          // from the template to populate the form
          const exercises = template.exercises as unknown as TemplateExercise[]
          if (exercises && exercises.length > 0) {
            const firstExercise = exercises[0]
            setFormData((prev) => ({
              ...prev,
              exercise: firstExercise.exercise,
              sets: firstExercise.sets,
              reps: firstExercise.reps,
              weight: firstExercise.weight,
              notes: firstExercise.notes || "",
            }))
          }
        }
        setTemplateLoading(false)
      }
    }

    loadTemplate()
  }, [templateId, user, getTemplate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "sets" || name === "reps" || name === "weight" ? (value === "" ? 0 : Number.parseFloat(value)) : value,
    }))
  }

  const handleExerciseSelect = (selectedExerciseName: string) => {
    setFormData((prev) => ({
      ...prev,
      exercise: selectedExerciseName,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    try {
      if (workout?.id) {
        const result = await updateWorkout(workout.id, formData as WorkoutUpdate)
        if (!result) {
          throw new Error("Failed to update workout")
        }
      } else {
        const result = await createWorkout({
          ...(formData as WorkoutInsert),
          user_id: user.id,
        })
        if (!result) {
          throw new Error("Failed to create workout")
        }
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/workouts")
        router.refresh()
      }
    } catch (err) {
      console.error("Error saving workout:", err)
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
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exercise">Exercise</Label>
            <ExerciseSelectDropdown
              selectedExerciseName={formData.exercise}
              onExerciseSelect={handleExerciseSelect}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets">Sets</Label>
              <Input
                id="sets"
                name="sets"
                type="number"
                min="1"
                value={formData.sets}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reps">Reps</Label>
              <Input
                id="reps"
                name="reps"
                type="number"
                min="1"
                value={formData.reps}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                min="0"
                step="0.5"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              placeholder="Any additional notes about this workout..."
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : workout ? "Update Workout" : "Add Workout"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
