import { MetricsForm } from '@/components/progress/MetricsForm';

export default function NewMetricsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add Metrics</h1>
      </div>
      <MetricsForm />
    </div>
  );
}
