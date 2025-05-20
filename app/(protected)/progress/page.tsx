import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProgressCharts } from '@/components/progress/ProgressCharts';
import { CardDescription } from '@/components/ui/card';

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress</h1>
          <CardDescription>
            Track your weight and body fat percentage over time
          </CardDescription>
        </div>
        <Button asChild>
          <Link href="/progress/new">Add Metrics</Link>
        </Button>
      </div>
      <ProgressCharts />
    </div>
  );
}
