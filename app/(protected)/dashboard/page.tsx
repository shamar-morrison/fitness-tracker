import { MetricsDashboard } from '@/components/dashboard/MetricsDashboard';
import { WorkoutSummary } from '@/components/dashboard/WorkoutSummary';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <MetricsDashboard />
      <WorkoutSummary />
    </div>
  );
}
