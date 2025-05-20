"use client"

import { useAuth } from "@/contexts/AuthContext"
import { supabaseClient } from "@/lib/supabase/client"
import type { Exercise, ExerciseInsert } from "@/lib/supabase/types"
import { useCallback, useEffect, useState } from "react"

export interface CategorizedExercise {
  category: string
  exercises: Exercise[]
}

export function useExercises() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [categorizedExercises, setCategorizedExercises] = useState<CategorizedExercise[]>([])

  const fetchExercises = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)
    try {
      // RLS policies will ensure only preset and user's own custom exercises are fetched.
      const { data, error: fetchError } = await supabaseClient
        .from("exercises")
        .select("*")
        .order("name", { ascending: true })

      if (fetchError) throw fetchError

      setAllExercises(data || [])
    } catch (err: any) {
      setError(err.message)
      setAllExercises([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchExercises()
  }, [fetchExercises])

  useEffect(() => {
    if (allExercises.length > 0) {
      const categories: { [key: string]: Exercise[] } = {}
      allExercises.forEach((exercise) => {
        if (!categories[exercise.category]) {
          categories[exercise.category] = []
        }
        categories[exercise.category].push(exercise)
      })

      const sortedCategorized = Object.keys(categories)
        .sort()
        .map((category) => ({
          category,
          exercises: categories[category].sort((a, b) => a.name.localeCompare(b.name)),
        }))
      setCategorizedExercises(sortedCategorized)
    } else {
      setCategorizedExercises([])
    }
  }, [allExercises])

  const createExercise = useCallback(
    async (exerciseData: Omit<ExerciseInsert, "user_id" | "is_preset">) => {
      if (!user) {
        setError("User not authenticated")
        return null
      }

      setLoading(true)
      setError(null)
      try {
        const { data, error: insertError } = await supabaseClient
          .from("exercises")
          .insert({
            ...exerciseData,
            user_id: user.id,
            is_preset: false, // Explicitly set for user-created exercises
          })
          .select()
          .single()

        if (insertError) throw insertError

        // Refetch exercises to include the new one
        await fetchExercises()
        return data as Exercise
      } catch (err: any) {
        setError(err.message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [user, fetchExercises]
  )

  return {
    loading,
    error,
    allExercises,
    categorizedExercises,
    createExercise,
    refetchExercises: fetchExercises,
  }
} 