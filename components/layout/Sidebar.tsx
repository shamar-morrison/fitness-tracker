"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart, Dumbbell, Home, User, Clipboard, LineChart } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/workouts",
      label: "Workouts",
      icon: Dumbbell,
    },
    {
      href: "/templates",
      label: "Templates",
      icon: Clipboard,
    },
    {
      href: "/progress",
      label: "Progress",
      icon: BarChart,
    },
    {
      href: "/stats",
      label: "Statistics",
      icon: LineChart,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex h-14 items-center border-b px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">FitTrackr</span>
        </Link>
      </div>
      <div className="flex-1 py-2">
        <nav className="grid gap-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "flex h-10 items-center justify-start gap-2 px-4 text-sm font-medium",
                pathname === route.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
