import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WorkoutHistory } from '@/components/workouts/WorkoutHistory';
import { CardDescription } from '@/components/ui/card';

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {' '}
          <h1 className="text-3xl font-bold">Workouts</h1>
          <CardDescription>
            View and manage your workout history
          </CardDescription>
        </div>
        <Button asChild>
          <Link href="/workouts/new">Add Workout</Link>
        </Button>
      </div>
      <WorkoutHistory />
    </div>
  );
}
