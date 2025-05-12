import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

// Get all grades (principal only)
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
    const studentId = searchParams.get("studentId")
    const assignmentId = searchParams.get("assignmentId")
    
    let grades
    
    if (studentId) {
      grades = await db.getGradesByStudentId(studentId)
    } else if (assignmentId) {
      grades = await db.getGradesByAssignmentId(assignmentId)
    } else {
      grades = await db.getGrades()
    }
    
    return NextResponse.json({ grades })
  } catch (error) {
    console.error("Error fetching grades:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching grades" },
      { status: 500 }
    )
  }
}

// Create a grade (teachers only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const gradeData = await request.json()
    
    if (!gradeData.studentId || !gradeData.assignmentId || gradeData.points === undefined) {
      return NextResponse.json(
        { message: "Student ID, assignment ID, and points are required" },
        { status: 400 }
      )
    }
    
    // Get the assignment to verify the teacher has access
    const assignment = await db.getAssignmentById(gradeData.assignmentId)
    
    if (!assignment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 }
      )
    }
    
    // Get the class
    const classRecord = await db.getClassById(assignment.classId)
    
    if (!classRecord) {
      return NextResponse.json(
        { message: "Class not found" },
        { status: 404 }
      )
    }
    
    // Verify the teacher teaches this class
    const teachers = await db.getTeachers()
    const teacher = teachers.find(t => t.userId === session.user.id)
    
    if (!teacher || !teacher.classIds.includes(classRecord.id)) {
      return NextResponse.json(
        { message: "Unauthorized to grade assignments for this class" },
        { status: 401 }
      )
    }
    
    // Create the grade
    const newGrade = await db.createGrade({
      studentId: gradeData.studentId,
      assignmentId: gradeData.assignmentId,
      points: gradeData.points,
      feedback: gradeData.feedback
    })
    
    return NextResponse.json({ 
      message: "Grade created successfully", 
      grade: newGrade 
    })
  } catch (error) {
    console.error("Error creating grade:", error)
    return NextResponse.json(
      { message: "An error occurred while creating grade" },
      { status: 500 }
    )
  }
}
