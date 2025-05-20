import { TemplateForm } from '@/components/templates/TemplateForm';

export default function NewTemplatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Workout Template</h1>
      </div>
      <TemplateForm />
    </div>
  );
}
