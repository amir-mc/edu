"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const redirectToRoleDashboard = async () => {
      try {
        const response = await fetch("/api/users/current")
        
        if (response.ok) {
          const data = await response.json()
          router.push(`/dashboard/${data.user.role}`)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        router.push("/login")
      }
    }

    redirectToRoleDashboard()
  }, [router])

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
