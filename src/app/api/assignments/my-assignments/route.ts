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
    
    // Find the student record associated with this user
    const students = await db.getStudents()
    const student = students.find(s => s.userId === session.user.id)
    
    if (!student) {
      return NextResponse.json(
        { message: "Student profile not found" },
        { status: 404 }
      )
    }
    
    // Get all classes for this student
    const classes = await Promise.all(
      student.classIds.map(id => db.getClassById(id))
    )
    
    // Get assignments for all classes
    const assignmentPromises = classes.map(async classRecord => {
      if (!classRecord) return []
      
      const classAssignments = await db.getAssignmentsByClassId(classRecord.id)
      return classAssignments.map(assignment => ({
        ...assignment,
        className: classRecord.name,
        // Add status (would be based on submissions in a real app)
        status: determineAssignmentStatus(assignment)
      }))
    })
    
    const allAssignments = await Promise.all(assignmentPromises)
    const flattenedAssignments = allAssignments.flat()
    
    return NextResponse.json({ assignments: flattenedAssignments })
  } catch (error) {
    console.error("Error fetching student assignments:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching assignments" },
      { status: 500 }
    )
  }
}

function determineAssignmentStatus(assignment: any) {
  // This is a simplified version - in a real app, we would check if the student has submitted
  // and compare due dates, etc.
  const dueDate = new Date(assignment.dueDate)
  const now = new Date()
  
  if (dueDate < now) {
    // Past due date
    return Math.random() > 0.7 ? "completed" : "overdue"
  } else if (dueDate.getTime() - now.getTime() < 86400000 * 3) {
    // Due within 3 days
    return Math.random() > 0.5 ? "in-progress" : "upcoming"
  } else {
    return "upcoming"
  }
}
