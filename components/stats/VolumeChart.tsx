'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { VolumeData } from '@/hooks/useWorkoutStats';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface VolumeChartProps {
  volumeData: VolumeData[];
  isLoading: boolean;
}

export function VolumeChart({ volumeData, isLoading }: VolumeChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workout Volume</CardTitle>
          <CardDescription>
            Total volume (weight × sets × reps) per workout day
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </CardContent>
      </Card>
    );
  }

  if (volumeData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workout Volume</CardTitle>
          <CardDescription>
            Total volume (weight × sets × reps) per workout day
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <p className="text-center text-muted-foreground">
            No workout data available to display volume.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Volume</CardTitle>
        <CardDescription>
          Total volume (weight × sets × reps) per workout day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <ChartContainer
            config={{
              volume: {
                label: 'Volume',
                color: 'hsl(var(--chart-3))',
              },
            }}
          >
            <AreaChart
              data={volumeData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                tickMargin={10}
                minTickGap={10}
              />
              <YAxis />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => value}
                    formatter={(value) => `${value.toLocaleString()} lbs`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="var(--color-volume)"
                fill="var(--color-volume)"
                fillOpacity={0.2}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
