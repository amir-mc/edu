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
    
    const classId = params.id
    
    // Check if user has access to this class
    if (session.user.role === "teacher") {
      // Verify the teacher teaches this class
      const teachers = await db.getTeachers()
      const teacher = teachers.find(t => t.userId === session.user.id)
      
      if (!teacher || !teacher.classIds.includes(classId)) {
        return NextResponse.json(
          { message: "Unauthorized to view this class" },
          { status: 401 }
        )
      }
    } else if (session.user.role === "student") {
      // Students can only see their own classes
      const students = await db.getStudents()
      const student = students.find(s => s.userId === session.user.id)
      
      if (!student || !student.classIds.includes(classId)) {
        return NextResponse.json(
          { message: "Unauthorized to view this class" },
          { status: 401 }
        )
      }
    } else if (session.user.role === "parent") {
      // Parents can only see their children's classes
      const parents = await db.getParents()
      const parent = parents.find(p => p.userId === session.user.id)
      
      if (!parent) {
        return NextResponse.json(
          { message: "Parent profile not found" },
          { status: 404 }
        )
      }
      
      // Check if any of their children are in this class
      const children = await Promise.all(
        parent.studentIds.map(id => db.getStudentById(id))
      )
      
      const childInClass = children.some(child => 
        child && child.classIds.includes(classId)
      )
      
      if (!childInClass) {
        return NextResponse.json(
          { message: "Unauthorized to view this class" },
          { status: 401 }
        )
      }
    } else if (session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized to view class grades" },
        { status: 401 }
      )
    }
    
    // Get the class to ensure it exists
    const classRecord = await db.getClassById(classId)
    
    if (!classRecord) {
      return NextResponse.json(
        { message: "Class not found" },
        { status: 404 }
      )
    }
    
    // Get all assignments for this class
    const assignments = await db.getAssignmentsByClassId(classId)
    
    // Get all grades for all assignments
    let allGrades = []
    for (const assignment of assignments) {
      const grades = await db.getGradesByAssignmentId(assignment.id)
      
      // Enhance grades with assignment information
      const enhancedGrades = grades.map(grade => ({
        id: grade.id,
        assignmentTitle: assignment.title,
        subject: classRecord.subject,
        points: grade.points,
        maxPoints: assignment.maxPoints,
        feedback: grade.feedback,
        createdAt: grade.createdAt,
        studentId: grade.studentId,
        assignmentId: grade.assignmentId
      }))
      
      allGrades.push(...enhancedGrades)
    }
    
    // If user is a student, filter to show only their grades
    if (session.user.role === "student") {
      const students = await db.getStudents()
      const student = students.find(s => s.userId === session.user.id)
      
      if (student) {
        allGrades = allGrades.filter(grade => grade.studentId === student.id)
      }
    }
    
    // If user is a parent, filter to show only their children's grades
    if (session.user.role === "parent") {
      const parents = await db.getParents()
      const parent = parents.find(p => p.userId === session.user.id)
      
      if (parent) {
        allGrades = allGrades.filter(grade => 
          parent.studentIds.includes(grade.studentId)
        )
      }
    }
    
    return NextResponse.json({ grades: allGrades })
  } catch (error) {
    console.error("Error fetching class grades:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching class grades" },
      { status: 500 }
    )
  }
}
