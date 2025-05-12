import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "teacher") {
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
        description: "You posted a new assignment for Mathematics 101",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        type: "assignment"
      },
      {
        id: "activity-2",
        description: "You graded 15 Science tests",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        type: "grade"
      },
      {
        id: "activity-3",
        description: "You marked attendance for History class",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: "attendance"
      },
      {
        id: "activity-4",
        description: "You sent a message to John Smith's parents",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        type: "message"
      },
      {
        id: "activity-5",
        description: "You scheduled a review session for Friday",
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        type: "event"
      },
      {
        id: "activity-6",
        description: "You updated the syllabus for Physics 202",
        timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        type: "event"
      },
      {
        id: "activity-7",
        description: "You commented on Emma Johnson's essay",
        timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        type: "grade"
      }
    ]
    
    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Error fetching teacher activities:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching activities" },
      { status: 500 }
    )
  }
}
