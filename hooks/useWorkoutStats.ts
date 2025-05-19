"use client"

import { useState, useMemo, useCallback } from "react"
import { useWorkouts } from "./useWorkouts"
import { useAuth } from "./useAuth"
import type { Workout } from "@/lib/supabase/types"
import { formatDate } from "@/lib/utils/date-utils"

export type TimeRange = "1m" | "3m" | "6m" | "1y" | "all"

export type ExerciseProgress = {
  exercise: string
  dates: string[]
  weights: number[]
  formattedDates: string[]
}

export type WorkoutFrequency = {
  date: string
  count: number
  formattedDate: string
}

export type VolumeData = {
  date: string
  volume: number
  formattedDate: string
}

export type ExerciseDistribution = {
  exercise: string
  count: number
  percentage: number
}

export type PersonalRecord = {
  exercise: string
  weight: number
  date: string
  formattedDate: string
}

export function useWorkoutStats() {
  const { user } = useAuth()
  const { getWorkouts } = useWorkouts()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>("3m")
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Use useCallback to memoize the fetchWorkouts function
  const fetchWorkouts = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      let startDate: string | undefined

      const now = new Date()
      switch (timeRange) {
        case "1m":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split("T")[0]
          break
        case "3m":
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).toISOString().split("T")[0]
          break
        case "6m":
          startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).toISOString().split("T")[0]
          break
        case "1y":
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split("T")[0]
          break
        default:
          startDate = undefined
      }

      const data = await getWorkouts(user.id, startDate)
      setWorkouts(data)

      // Set the first exercise as selected if none is selected
      if (!selectedExercise && data.length > 0) {
        const exercises = [...new Set(data.map((workout) => workout.exercise))]
        if (exercises.length > 0) {
          setSelectedExercise(exercises[0])
        }
      }
    } catch (error) {
      console.error("Error fetching workouts:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user, timeRange, selectedExercise, getWorkouts])

  // Get unique exercises from workouts
  const exercises = useMemo(() => {
    const exerciseSet = new Set(workouts.map((workout) => workout.exercise))
    return Array.from(exerciseSet).sort()
  }, [workouts])

  // Calculate exercise progress over time
  const exerciseProgress = useMemo(() => {
    if (!selectedExercise) return null

    const filteredWorkouts = workouts
      .filter((workout) => workout.exercise === selectedExercise)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    if (filteredWorkouts.length === 0) return null

    return {
      exercise: selectedExercise,
      dates: filteredWorkouts.map((workout) => workout.date),
      weights: filteredWorkouts.map((workout) => Number(workout.weight)),
      formattedDates: filteredWorkouts.map((workout) => formatDate(workout.date)),
    }
  }, [workouts, selectedExercise])

  // Calculate workout frequency over time
  const workoutFrequency = useMemo(() => {
    const frequencyMap = new Map<string, number>()

    // Group workouts by date
    workouts.forEach((workout) => {
      const date = workout.date
      frequencyMap.set(date, (frequencyMap.get(date) || 0) + 1)
    })

    // Convert to array and sort by date
    const frequencyArray = Array.from(frequencyMap.entries())
      .map(([date, count]) => ({
        date,
        count,
        formattedDate: formatDate(date),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return frequencyArray
  }, [workouts])

  // Calculate total volume (weight * sets * reps) per workout date
  const volumeData = useMemo(() => {
    const volumeMap = new Map<string, number>()

    // Calculate volume for each workout and group by date
    workouts.forEach((workout) => {
      const date = workout.date
      const volume = Number(workout.weight) * workout.sets * workout.reps
      volumeMap.set(date, (volumeMap.get(date) || 0) + volume)
    })

    // Convert to array and sort by date
    const volumeArray = Array.from(volumeMap.entries())
      .map(([date, volume]) => ({
        date,
        volume,
        formattedDate: formatDate(date),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return volumeArray
  }, [workouts])

  // Calculate exercise distribution
  const exerciseDistribution = useMemo(() => {
    const distributionMap = new Map<string, number>()

    // Count occurrences of each exercise
    workouts.forEach((workout) => {
      const exercise = workout.exercise
      distributionMap.set(exercise, (distributionMap.get(exercise) || 0) + 1)
    })

    // Calculate total workouts
    const totalWorkouts = workouts.length

    // Convert to array with percentages
    const distributionArray = Array.from(distributionMap.entries())
      .map(([exercise, count]) => ({
        exercise,
        count,
        percentage: totalWorkouts > 0 ? (count / totalWorkouts) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)

    return distributionArray
  }, [workouts])

  // Calculate personal records for each exercise
  const personalRecords = useMemo(() => {
    const prMap = new Map<string, { weight: number; date: string }>()

    // Find max weight for each exercise
    workouts.forEach((workout) => {
      const exercise = workout.exercise
      const weight = Number(workout.weight)
      const currentPR = prMap.get(exercise)

      if (!currentPR || weight > currentPR.weight) {
        prMap.set(exercise, { weight, date: workout.date })
      }
    })

    // Convert to array
    const prArray = Array.from(prMap.entries())
      .map(([exercise, { weight, date }]) => ({
        exercise,
        weight,
        date,
        formattedDate: formatDate(date),
      }))
      .sort((a, b) => b.weight - a.weight)

    return prArray
  }, [workouts])

  return {
    workouts,
    exercises,
    exerciseProgress,
    workoutFrequency,
    volumeData,
    exerciseDistribution,
    personalRecords,
    selectedExercise,
    timeRange,
    isLoading,
    setSelectedExercise,
    setTimeRange,
    fetchWorkouts,
  }
}
