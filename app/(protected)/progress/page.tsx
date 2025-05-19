import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProgressCharts } from "@/components/progress/ProgressCharts"

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Progress</h1>
        <Button asChild>
          <Link href="/progress/new">Add Metrics</Link>
        </Button>
      </div>
      <ProgressCharts />
    </div>
  )
}
