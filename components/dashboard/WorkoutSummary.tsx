"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useWorkouts } from "@/hooks/useWorkouts"
import { useAuth } from "@/hooks/useAuth"
import type { Workout } from "@/lib/supabase/types"
import { formatDate } from "@/lib/utils/date-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function WorkoutSummary() {
  const { user } = useAuth()
  const { getWorkouts } = useWorkouts()
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (user) {
        const data = await getWorkouts(user.id)
        // Get the 5 most recent workouts
        const recent = data.slice(0, 5)
        setRecentWorkouts(recent)
        setIsLoading(false)
      }
    }

    fetchWorkouts()
  }, [user, getWorkouts])

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
          <CardDescription>Your most recent workout sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (recentWorkouts.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
          <CardDescription>Your most recent workout sessions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <p className="mb-4 text-center text-muted-foreground">You haven&apos;t logged any workouts yet.</p>
          <Button asChild>
            <Link href="/workouts/new">Log Your First Workout</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Workouts</CardTitle>
          <CardDescription>Your most recent workout sessions</CardDescription>
        </div>
        <Button asChild>
          <Link href="/workouts">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentWorkouts.map((workout) => (
            <Card key={workout.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{workout.exercise}</CardTitle>
                  <Badge variant="outline">{formatDate(workout.date)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Sets</p>
                    <p className="font-medium">{workout.sets}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reps</p>
                    <p className="font-medium">{workout.reps}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="font-medium">{workout.weight} lbs</p>
                  </div>
                </div>
                {workout.notes && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="text-sm">{workout.notes}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/workouts/${workout.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
