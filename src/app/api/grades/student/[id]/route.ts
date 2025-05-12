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
    
    // Check if user is authorized to view this student's grades
    if (session.user.role === "parent") {
      // Verify the student is this parent's child
      const parents = await db.getParents()
      const parent = parents.find(p => p.userId === session.user.id)
      
      if (!parent || !parent.studentIds.includes(studentId)) {
        return NextResponse.json(
          { message: "Unauthorized to view this student's grades" },
          { status: 401 }
        )
      }
    } else if (session.user.role === "teacher") {
      // Verify the student is in one of the teacher's classes
      const teachers = await db.getTeachers()
      const teacher = teachers.find(t => t.userId === session.user.id)
      
      if (!teacher) {
        return NextResponse.json(
          { message: "Teacher profile not found" },
          { status: 404 }
        )
      }
      
      const student = await db.getStudentById(studentId)
      
      if (!student) {
        return NextResponse.json(
          { message: "Student not found" },
          { status: 404 }
        )
      }
      
      // Check if the student and teacher share any classes
      const sharedClasses = student.classIds.filter(classId => 
        teacher.classIds.includes(classId)
      )
      
      if (sharedClasses.length === 0) {
        return NextResponse.json(
          { message: "Unauthorized to view this student's grades" },
          { status: 401 }
        )
      }
    } else if (session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized to view student grades" },
        { status: 401 }
      )
    }
    
    // Get all grades for this student
    const grades = await db.getGradesByStudentId(studentId)
    
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
