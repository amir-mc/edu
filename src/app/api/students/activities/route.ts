import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "student") {
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
        description: "New assignment posted in Mathematics 101",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        type: "assignment"
      },
      {
        id: "activity-2",
        description: "Your Science test has been graded",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        type: "grade"
      },
      {
        id: "activity-3",
        description: "You were marked present in History class",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: "attendance"
      },
      {
        id: "activity-4",
        description: "New message from Mrs. Thompson",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        type: "message"
      },
      {
        id: "activity-5",
        description: "School assembly scheduled for Friday",
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        type: "event"
      }
    ]
    
    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Error fetching student activities:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching activities" },
      { status: 500 }
    )
  }
}
