"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ExerciseDistribution } from "@/hooks/useWorkoutStats"
import { Cell, Legend, Pie, PieChart } from "recharts"

interface ExerciseDistributionChartProps {
  exerciseDistribution: ExerciseDistribution[]
  isLoading: boolean
}

// editor_note: Added a basic chartConfig, can be expanded if specific colors per slice are managed via config
const chartConfig = {};

export function ExerciseDistributionChart({ exerciseDistribution, isLoading }: ExerciseDistributionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercise Distribution</CardTitle>
          <CardDescription>Breakdown of exercises performed</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </CardContent>
      </Card>
    )
  }

  if (exerciseDistribution.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercise Distribution</CardTitle>
          <CardDescription>Breakdown of exercises performed</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <p className="text-center text-muted-foreground">No workout data available to display distribution.</p>
        </CardContent>
      </Card>
    )
  }

  // Limit to top 8 exercises for better visualization
  const topExercises = exerciseDistribution.slice(0, 8)

  // If there are more than 8 exercises, group the rest as "Others"
  if (exerciseDistribution.length > 8) {
    const othersCount = exerciseDistribution.slice(8).reduce((sum, item) => sum + item.count, 0)
    const othersPercentage = exerciseDistribution.slice(8).reduce((sum, item) => sum + item.percentage, 0)

    topExercises.push({
      exercise: "Others",
      count: othersCount,
      percentage: othersPercentage,
    })
  }

  // Generate colors for the pie chart
  const COLORS = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#f97316", // orange-500
    "#6b7280", // gray-500 (for Others)
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Distribution</CardTitle>
        <CardDescription>Breakdown of exercises performed</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={topExercises}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="exercise"
                label={({ exercise, percentage }) => `${exercise} (${percentage.toFixed(1)}%)`}
                // Add animation properties to the pie
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1500}
                animationEasing="ease-in-out"
              >
                {topExercises.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(name) => name}
                    formatter={(value, name, props) => {
                      const item = props.payload
                      return [`${value} (${item.percentage.toFixed(1)}%)`, "Count"]
                    }}
                  />
                }
              />
              <Legend
                // Add animation to the legend
                wrapperStyle={{ paddingTop: 20 }}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
