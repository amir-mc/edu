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
    
    // Get all grades for this student
    const grades = await db.getGradesByStudentId(student.id)
    
    // Enhance grades with assignment and class information
    const enhancedGrades = await Promise.all(
      grades.map(async (grade) => {
        const assignment = await db.getAssignmentById(grade.assignmentId)
        
        if (!assignment) {
          return null
        }
        
        const classRecord = await db.getClassById(assignment.classId)
        
        return {
          id: grade.id,
          assignmentTitle: assignment.title,
          subject: classRecord ? classRecord.subject : "Unknown",
          points: grade.points,
          maxPoints: assignment.maxPoints,
          feedback: grade.feedback,
          createdAt: grade.createdAt
        }
      })
    )
    
    // Filter out any null values
    const validGrades = enhancedGrades.filter(Boolean)
    
    return NextResponse.json({ grades: validGrades })
  } catch (error) {
    console.error("Error fetching student grades:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching grades" },
      { status: 500 }
    )
  }
}
