'use client';

import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkoutStats, type TimeRange } from '@/hooks/useWorkoutStats';
import { useEffect } from 'react';
import { ExerciseDistributionChart } from './ExerciseDistributionChart';
import { ExerciseProgressChart } from './ExerciseProgressChart';
import { PersonalRecordsTable } from './PersonalRecordsTable';
import { VolumeChart } from './VolumeChart';
import { WorkoutFrequencyChart } from './WorkoutFrequencyChart';

// Placeholder chartConfig - populate this with actual configuration
const chartConfig = {
  // Example (you will need to define these based on your data keys):
  // volume: {
  //   label: "Volume (lbs)",
  //   color: "hsl(var(--chart-1))",
  // },
  // frequency: {
  //   label: "Workouts",
  //   color: "hsl(var(--chart-2))",
  // },
  // Add other data keys used in your charts here
} satisfies ChartConfig;

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
  } = useWorkoutStats();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchWorkouts();
      } catch (error) {
        console.error('Error loading workout stats:', error);
      }
    };

    loadData();
  }, [timeRange, fetchWorkouts]);

  const handleExerciseChange = (exercise: string) => {
    setSelectedExercise(exercise);
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as TimeRange);
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
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
          <VolumeChart
            key={`volume-${timeRange}`}
            volumeData={volumeData}
            isLoading={isLoading}
          />
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
    </ChartContainer>
  );
}
