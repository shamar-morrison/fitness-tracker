"use client"

import { useState, useEffect } from "react"
import { useWorkouts } from "@/hooks/useWorkouts"
import { useMetrics } from "@/hooks/useMetrics"
import { useAuth } from "@/hooks/useAuth"
import type { Workout } from "@/lib/supabase/types"
import { getMonthRange } from "@/lib/utils/date-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Dumbbell, Scale, TrendingUp } from "lucide-react"

export function MetricsDashboard() {
  const { user } = useAuth()
  const { getWorkouts } = useWorkouts()
  const { getMetrics } = useMetrics()
  const [_, setWorkouts] = useState<Workout[]>([])
  const [totalWorkouts, setTotalWorkouts] = useState(0)
  const [monthlyWorkouts, setMonthlyWorkouts] = useState(0)
  const [latestWeight, setLatestWeight] = useState<number | null>(null)
  const [weightChange, setWeightChange] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // Get all workouts
        const workoutsData = await getWorkouts(user.id)
        setWorkouts(workoutsData)
        setTotalWorkouts(workoutsData.length)

        // Get monthly workouts
        const currentDate = new Date()
        const { start, end } = getMonthRange(currentDate)
        const monthlyWorkoutsData = await getWorkouts(user.id, start, end)
        setMonthlyWorkouts(monthlyWorkoutsData.length)

        // Get metrics for weight tracking
        const metricsData = await getMetrics(user.id)

        if (metricsData.length > 0) {
          // Sort by date descending to get latest
          const sortedMetrics = [...metricsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

          const latest = sortedMetrics[0]
          if (latest.weight) {
            setLatestWeight(latest.weight)

            // Calculate weight change if we have at least 2 entries
            if (sortedMetrics.length > 1) {
              const oldest = sortedMetrics[sortedMetrics.length - 1]
              if (oldest.weight) {
                setWeightChange(latest.weight - oldest.weight)
              }
            }
          }
        }

        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, getWorkouts, getMetrics])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWorkouts}</div>
          <p className="text-xs text-muted-foreground">Lifetime logged workouts</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthlyWorkouts}</div>
          <p className="text-xs text-muted-foreground">Workouts this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestWeight ? `${latestWeight} lbs` : "Not logged"}</div>
          <p className="text-xs text-muted-foreground">Latest recorded weight</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weight Change</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {weightChange !== null ? `${weightChange > 0 ? "+" : ""}${weightChange} lbs` : "Not enough data"}
          </div>
          <p className="text-xs text-muted-foreground">Since first recorded weight</p>
        </CardContent>
      </Card>
    </div>
  )
}
