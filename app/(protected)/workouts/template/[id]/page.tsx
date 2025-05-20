'use client';

import { useParams } from 'next/navigation';
import { TemplateWorkoutForm } from '@/components/templates/TemplateWorkoutForm';

export default function LogWorkoutFromTemplatePage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Log Workout from Template</h1>
      </div>
      <TemplateWorkoutForm templateId={id as string} />
    </div>
  );
}
