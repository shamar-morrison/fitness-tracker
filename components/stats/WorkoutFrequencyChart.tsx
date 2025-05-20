"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { WorkoutFrequency } from "@/hooks/useWorkoutStats"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface WorkoutFrequencyChartProps {
  workoutFrequency: WorkoutFrequency[]
  isLoading: boolean
}

export function WorkoutFrequencyChart({ workoutFrequency, isLoading }: WorkoutFrequencyChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workout Frequency</CardTitle>
          <CardDescription>Number of workouts logged per day</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </CardContent>
      </Card>
    )
  }

  if (workoutFrequency.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workout Frequency</CardTitle>
          <CardDescription>Number of workouts logged per day</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <p className="text-center text-muted-foreground">No workout data available to display frequency.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Frequency</CardTitle>
        <CardDescription>Number of workouts logged per day</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <ChartContainer
            config={{
              count: {
                label: "Workouts",
                color: "hsl(var(--chart-2))",
              },
            }}
          >
            <BarChart
              data={workoutFrequency}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} tickMargin={10} minTickGap={10} />
              <YAxis allowDecimals={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => value}
                    formatter={(value) => `${value} workout${value !== 1 ? "s" : ""}`}
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
