import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WorkoutHistory } from "@/components/workouts/WorkoutHistory"

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workouts</h1>
        <Button asChild>
          <Link href="/workouts/new">Add Workout</Link>
        </Button>
      </div>
      <WorkoutHistory />
    </div>
  )
}
