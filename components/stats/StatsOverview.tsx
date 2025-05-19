"use client"

import { useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExerciseProgressChart } from "./ExerciseProgressChart"
import { WorkoutFrequencyChart } from "./WorkoutFrequencyChart"
import { VolumeChart } from "./VolumeChart"
import { ExerciseDistributionChart } from "./ExerciseDistributionChart"
import { PersonalRecordsTable } from "./PersonalRecordsTable"
import { useWorkoutStats, type TimeRange } from "@/hooks/useWorkoutStats"

export function StatsOverview() {
  const {
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
  } = useWorkoutStats()

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchWorkouts()
      } catch (error) {
        console.error("Error loading workout stats:", error)
      }
    }

    loadData()
  }, [timeRange, fetchWorkouts])

  const handleExerciseChange = (exercise: string) => {
    setSelectedExercise(exercise)
  }

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as TimeRange)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Workout Statistics</h1>
        <Tabs defaultValue={timeRange} onValueChange={handleTimeRangeChange}>
          <TabsList>
            <TabsTrigger value="1m">1 Month</TabsTrigger>
            <TabsTrigger value="3m">3 Months</TabsTrigger>
            <TabsTrigger value="6m">6 Months</TabsTrigger>
            <TabsTrigger value="1y">1 Year</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ExerciseProgressChart
          key={`exercise-progress-${timeRange}`}
          exercises={exercises}
          selectedExercise={selectedExercise}
          exerciseProgress={exerciseProgress}
          onExerciseChange={handleExerciseChange}
          isLoading={isLoading}
        />
        <WorkoutFrequencyChart
          key={`workout-frequency-${timeRange}`}
          workoutFrequency={workoutFrequency}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <VolumeChart key={`volume-${timeRange}`} volumeData={volumeData} isLoading={isLoading} />
        <ExerciseDistributionChart
          key={`exercise-distribution-${timeRange}`}
          exerciseDistribution={exerciseDistribution}
          isLoading={isLoading}
        />
      </div>

      <PersonalRecordsTable
        key={`personal-records-${timeRange}`}
        personalRecords={personalRecords}
        isLoading={isLoading}
      />
    </div>
  )
}
