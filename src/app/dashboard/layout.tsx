"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { User } from "@/types"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/users/current")
        
        if (!response.ok) {
          // If not authenticated, redirect to login
          router.push("/login")
          return
        }
        
        const data = await response.json()
        setUser(data.user)

        // Verify user is on the correct dashboard for their role
        const roleFromPath = pathname.split('/')[2]
        if (data.user.role !== roleFromPath) {
          router.push(`/dashboard/${data.user.role}`)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [pathname, router])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col md:ml-64">
        <Header user={user} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
