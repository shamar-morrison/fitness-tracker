import { TemplateList } from '@/components/templates/TemplateList';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workout Templates</h1>
          <CardDescription>
            Create and manage your workout templates
          </CardDescription>
        </div>
        <Button asChild>
          <Link href="/templates/new">Create Template</Link>
        </Button>
      </div>
      <TemplateList />
    </div>
  );
}
