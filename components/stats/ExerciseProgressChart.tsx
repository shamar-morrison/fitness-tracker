"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartLoader } from "./ChartLoader"
import type { ExerciseProgress } from "@/hooks/useWorkoutStats"

interface ExerciseProgressChartProps {
  exercises: string[]
  selectedExercise: string | null
  exerciseProgress: ExerciseProgress | null
  onExerciseChange: (exercise: string) => void
  isLoading: boolean
}

export function ExerciseProgressChart({
  exercises,
  selectedExercise,
  exerciseProgress,
  onExerciseChange,
  isLoading,
}: ExerciseProgressChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercise Progress</CardTitle>
          <CardDescription>Track your progress for specific exercises over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartLoader />
        </CardContent>
      </Card>
    )
  }

  if (exercises.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercise Progress</CardTitle>
          <CardDescription>Track your progress for specific exercises over time</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <p className="text-center text-muted-foreground">No workout data available to display progress.</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = exerciseProgress
    ? exerciseProgress.dates.map((date, index) => ({
        date,
        weight: exerciseProgress.weights[index],
        formattedDate: exerciseProgress.formattedDates[index],
      }))
    : []

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>Exercise Progress</CardTitle>
            <CardDescription>Track your progress for specific exercises over time</CardDescription>
          </div>
          <Select value={selectedExercise || ""} onValueChange={onExerciseChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select exercise" />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((exercise) => (
                <SelectItem key={exercise} value={exercise}>
                  {exercise}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ChartContainer
              config={{
                weight: {
                  label: "Weight",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} tickMargin={10} minTickGap={10} />
                  <YAxis domain={["auto", "auto"]} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent labelFormatter={(value) => value} formatter={(value) => `${value} lbs`} />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="var(--color-weight)"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    dot={{ strokeWidth: 2, r: 4, strokeDasharray: "" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-muted-foreground">
                {selectedExercise ? `No data available for ${selectedExercise}` : "Select an exercise to view progress"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
