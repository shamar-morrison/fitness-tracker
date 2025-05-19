"use client"

import Link from "next/link"

export function AuthNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">FitTrackr</span>
        </Link>
      </div>
    </header>
  )
}
