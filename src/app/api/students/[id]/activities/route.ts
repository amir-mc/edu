import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const studentId = params.id
    
    // Check if user is authorized to view this student's activities
    if (session.user.role === "parent") {
      // Verify the student is this parent's child
      const parents = await db.getParents()
      const parent = parents.find(p => p.userId === session.user.id)
      
      if (!parent || !parent.studentIds.includes(studentId)) {
        return NextResponse.json(
          { message: "Unauthorized to view this student's activities" },
          { status: 401 }
        )
      }
    } else if (session.user.role !== "teacher" && session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // In a real app, we would fetch actual activities from the database for this student
    // For this demo, we'll generate mock activities
    const activities = [
      {
        id: "activity-1",
        description: "Completed Mathematics homework assignment",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        type: "assignment"
      },
      {
        id: "activity-2",
        description: "Received an A on Science test",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        type: "grade"
      },
      {
        id: "activity-3",
        description: "Was tardy to History class",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: "attendance"
      },
      {
        id: "activity-4",
        description: "Replied to message from Mrs. Thompson",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        type: "message"
      },
      {
        id: "activity-5",
        description: "Signed up for Science Fair",
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
