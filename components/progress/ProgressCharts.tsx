"use client"

import { useState, useEffect } from "react"
import { useMetrics } from "@/hooks/useMetrics"
import { useAuth } from "@/hooks/useAuth"
import type { Metric } from "@/lib/supabase/types"
import { formatDate } from "@/lib/utils/date-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

export function ProgressCharts() {
  const { user } = useAuth()
  const { getMetrics } = useMetrics()
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("3m") // 1m, 3m, 6m, 1y, all

  useEffect(() => {
    const fetchMetrics = async () => {
      if (user) {
        let startDate
        const now = new Date()

        switch (timeRange) {
          case "1m":
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split("T")[0]
            break
          case "3m":
            startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).toISOString().split("T")[0]
            break
          case "6m":
            startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).toISOString().split("T")[0]
            break
          case "1y":
            startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split("T")[0]
            break
          default:
            startDate = undefined
        }

        const data = await getMetrics(user.id, startDate)
        // Sort by date ascending for charts
        const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        setMetrics(sortedData)
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [user, getMetrics, timeRange])

  const chartData = metrics.map((metric) => ({
    date: metric.date,
    weight: metric.weight,
    bodyFat: metric.body_fat,
  }))

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  if (metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracking</CardTitle>
          <CardDescription>You haven&apos;t logged any metrics yet.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <p className="text-center text-muted-foreground">
            Start tracking your progress by adding your weight, body fat percentage, and progress photos.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Tracking</CardTitle>
        <CardDescription>Track your weight and body fat percentage over time</CardDescription>
        <div className="mt-2">
          <Tabs defaultValue="3m" onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="1m">1 Month</TabsTrigger>
              <TabsTrigger value="3m">3 Months</TabsTrigger>
              <TabsTrigger value="6m">6 Months</TabsTrigger>
              <TabsTrigger value="1y">1 Year</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="h-80">
            <h3 className="mb-2 text-lg font-medium">Weight (lbs)</h3>
            <ChartContainer
              config={{
                weight: {
                  label: "Weight",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => formatDate(value)} />
                  <YAxis domain={["auto", "auto"]} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => formatDate(value)}
                        formatter={(value) => `${value} lbs`}
                      />
                    }
                  />
                  <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="h-80">
            <h3 className="mb-2 text-lg font-medium">Body Fat %</h3>
            <ChartContainer
              config={{
                bodyFat: {
                  label: "Body Fat",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => formatDate(value)} />
                  <YAxis domain={["auto", "auto"]} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => formatDate(value)}
                        formatter={(value) => `${value}%`}
                      />
                    }
                  />
                  <Line type="monotone" dataKey="bodyFat" stroke="var(--color-bodyFat)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
