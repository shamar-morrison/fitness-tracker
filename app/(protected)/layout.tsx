import type React from "react"
// import { Header } from "@/components/layout/Header"
import { AuthWrapper } from "@/components/auth/AuthWrapper"
import { Sidebar } from "@/components/layout/Sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthWrapper>
      <div className="flex min-h-screen flex-col">
        {/* <Header /> */}
        <div className="flex flex-1">
          <aside className="hidden w-64 border-r md:block">
            <Sidebar />
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthWrapper>
  )
}
