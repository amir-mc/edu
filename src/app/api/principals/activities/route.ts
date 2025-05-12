import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // In a real app, we would fetch actual activities from the database
    // For this demo, we'll generate mock activities
    const activities = [
      {
        id: "activity-1",
        description: "Teacher evaluation completed for Mrs. Thompson",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        type: "event"
      },
      {
        id: "activity-2",
        description: "School-wide attendance report generated",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        type: "attendance"
      },
      {
        id: "activity-3",
        description: "Parent-teacher conference scheduled for next Friday",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: "event"
      },
      {
        id: "activity-4",
        description: "School board meeting minutes approved",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        type: "event"
      },
      {
        id: "activity-5",
        description: "New curriculum proposal reviewed for Science department",
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        type: "event"
      },
      {
        id: "activity-6",
        description: "Budget allocation adjusted for Athletics department",
        timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        type: "event"
      },
      {
        id: "activity-7",
        description: "Staff meeting scheduled for next Monday",
        timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        type: "event"
      }
    ]
    
    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Error fetching principal activities:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching activities" },
      { status: 500 }
    )
  }
}
