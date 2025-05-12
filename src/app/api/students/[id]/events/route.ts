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
    
    // Check if user is authorized to view this student's events
    if (session.user.role === "parent") {
      // Verify the student is this parent's child
      const parents = await db.getParents()
      const parent = parents.find(p => p.userId === session.user.id)
      
      if (!parent || !parent.studentIds.includes(studentId)) {
        return NextResponse.json(
          { message: "Unauthorized to view this student's events" },
          { status: 401 }
        )
      }
    } else if (session.user.role !== "teacher" && session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // In a real app, we would fetch actual events from the database for this student
    // For this demo, we'll generate mock events
    const today = new Date()
    
    const events = [
      {
        id: "event-1",
        title: "Mathematics Test",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString(),
        time: "09:00 AM",
        type: "exam",
        description: "Chapter 7 Test"
      },
      {
        id: "event-2",
        title: "Science Project Due",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString(),
        time: "11:59 PM",
        type: "assignment",
        description: "Ecosystem model project"
      },
      {
        id: "event-3",
        title: "Language Arts Essay",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4).toISOString(),
        time: "11:59 PM",
        type: "assignment",
        description: "Analysis of The Great Gatsby"
      },
      {
        id: "event-4",
        title: "Field Trip",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10).toISOString(),
        time: "08:00 AM - 03:00 PM",
        type: "event",
        description: "Museum of Natural History"
      },
      {
        id: "event-5",
        title: "Math Tutoring",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString(),
        time: "03:30 PM",
        type: "class",
        description: "Extra help session with Mr. Johnson"
      }
    ]
    
    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching student events:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching events" },
      { status: 500 }
    )
  }
}
