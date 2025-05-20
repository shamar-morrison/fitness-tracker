"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

export default function Home() {
  const { user, loading } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Track Your Fitness Journey
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Log workouts, track progress, and achieve your fitness goals with FitTrackr.
                </p>
              </div>
              <div className="space-x-4">
                {!loading && !user && (
                  <>
                    <Button asChild size="lg">
                      <Link href="/auth/signup">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                  </>
                )}
                {!loading && user && (
                  <Button asChild size="lg">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted-foreground/10 px-3 py-1 text-sm">Track Workouts</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Log Your Workouts</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Keep a detailed record of your exercises, sets, reps, and weights. Monitor your progress over time and
                  identify areas for improvement.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="h-[300px] w-[400px] rounded-xl bg-muted-foreground/20"></div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex justify-center lg:order-last">
                <div className="h-[300px] w-[400px] rounded-xl bg-muted"></div>
              </div>
              <div className="space-y-4 lg:order-first">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Track Progress</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Monitor Your Metrics</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Track your weight, body fat percentage, and other key metrics. Visualize your progress with intuitive
                  charts and celebrate your achievements.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 FitTrackr. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
