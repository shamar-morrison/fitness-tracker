'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMetrics } from '@/hooks/useMetrics';
import { useAuth } from '@/hooks/useAuth';
import type { MetricInsert, MetricUpdate } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDateForInput } from '@/lib/utils/date-utils';

interface MetricsFormProps {
  metric?: MetricUpdate & { id: string };
  onSuccess?: () => void;
}

export function MetricsForm({ metric, onSuccess }: MetricsFormProps) {
  const { user } = useAuth();
  const { createMetric, updateMetric, uploadPhoto, loading, error } =
    useMetrics();
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<MetricInsert>>({
    date: metric?.date || formatDateForInput(new Date()),
    weight: metric?.weight || undefined,
    body_fat: metric?.body_fat || undefined,
    photo_url: metric?.photo_url || undefined,
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        setFile(fileInput.files[0]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === 'weight' || name === 'body_fat'
            ? value === ''
              ? undefined
              : Number.parseFloat(value)
            : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      let photoUrl = formData.photo_url;

      if (file) {
        setUploadLoading(true);
        photoUrl = await uploadPhoto(file, user.id);
        setUploadLoading(false);
      }

      const metricData = {
        ...formData,
        photo_url: photoUrl,
      };

      if (metric?.id) {
        await updateMetric(metric.id, metricData as MetricUpdate);
      } else {
        await createMetric({
          ...(metricData as MetricInsert),
          user_id: user.id,
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/progress');
        router.refresh();
      }
    } catch (err) {
      console.error('Error saving metric:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{metric ? 'Edit Metrics' : 'Add Metrics'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                min="0"
                step="0.1"
                value={formData.weight === undefined ? '' : formData.weight}
                onChange={handleChange}
                placeholder="Enter your weight"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_fat">Body Fat %</Label>
              <Input
                id="body_fat"
                name="body_fat"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.body_fat === undefined ? '' : formData.body_fat}
                onChange={handleChange}
                placeholder="Enter your body fat %"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Progress Photo</Label>
            <Input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
            {formData.photo_url && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Current photo:</p>
                <img
                  src={formData.photo_url || '/placeholder.svg'}
                  alt="Progress"
                  className="mt-1 h-40 rounded-md object-cover"
                />
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || uploadLoading}>
            {loading || uploadLoading
              ? 'Saving...'
              : metric
                ? 'Update Metrics'
                : 'Add Metrics'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
