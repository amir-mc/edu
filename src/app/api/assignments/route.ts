import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

// Get all assignments (requires admin/principal access)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Query parameters
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    
    let assignments
    
    if (classId) {
      assignments = await db.getAssignmentsByClassId(classId)
    } else {
      assignments = await db.getAssignments()
    }
    
    return NextResponse.json({ assignments })
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching assignments" },
      { status: 500 }
    )
  }
}

// Create an assignment (teachers only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const assignmentData = await request.json()
    
    if (!assignmentData.title || !assignmentData.classId || !assignmentData.dueDate) {
      return NextResponse.json(
        { message: "Title, class ID, and due date are required" },
        { status: 400 }
      )
    }
    
    // Verify the teacher teaches this class
    const teachers = await db.getTeachers()
    const teacher = teachers.find(t => t.userId === session.user.id)
    
    if (!teacher || !teacher.classIds.includes(assignmentData.classId)) {
      return NextResponse.json(
        { message: "Unauthorized to create assignments for this class" },
        { status: 401 }
      )
    }
    
    // Create the assignment
    const newAssignment = await db.createAssignment({
      title: assignmentData.title,
      description: assignmentData.description || "",
      classId: assignmentData.classId,
      dueDate: assignmentData.dueDate,
      maxPoints: assignmentData.maxPoints || 100
    })
    
    return NextResponse.json({ 
      message: "Assignment created successfully", 
      assignment: newAssignment 
    })
  } catch (error) {
    console.error("Error creating assignment:", error)
    return NextResponse.json(
      { message: "An error occurred while creating assignment" },
      { status: 500 }
    )
  }
}
