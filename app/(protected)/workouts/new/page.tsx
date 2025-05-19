import { WorkoutForm } from "@/components/workouts/WorkoutForm"

export default function NewWorkoutPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add Workout</h1>
      </div>
      <WorkoutForm />
    </div>
  )
}
