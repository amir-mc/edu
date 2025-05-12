import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

// Get students (teacher or principal only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || (session.user.role !== "teacher" && session.user.role !== "principal")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Query parameters
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    
    let students
    
    if (classId) {
      students = await db.getStudentsByClassId(classId)
    } else {
      students = await db.getStudents()
    }
    
    return NextResponse.json({ students })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching students" },
      { status: 500 }
    )
  }
}

// Get student profile (for the student themself)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // If user is a student, return their own profile
    if (session.user.role === "student") {
      // Find the student record associated with this user
      const students = await db.getStudents()
      const student = students.find(s => s.userId === session.user.id)
      
      if (!student) {
        return NextResponse.json(
          { message: "Student profile not found" },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ student })
    }
    
    // If user is a teacher or principal, they need a studentId param
    if (session.user.role === "teacher" || session.user.role === "principal") {
      const { searchParams } = new URL(request.url)
      const studentId = searchParams.get("studentId")
      
      if (!studentId) {
        return NextResponse.json(
          { message: "Student ID is required" },
          { status: 400 }
        )
      }
      
      const student = await db.getStudentById(studentId)
      
      if (!student) {
        return NextResponse.json(
          { message: "Student not found" },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ student })
    }
    
    // Parents can view their children
    if (session.user.role === "parent") {
      // Find the parent record associated with this user
      const parents = await db.getParents()
      const parent = parents.find(p => p.userId === session.user.id)
      
      if (!parent) {
        return NextResponse.json(
          { message: "Parent profile not found" },
          { status: 404 }
        )
      }
      
      const { searchParams } = new URL(request.url)
      const studentId = searchParams.get("studentId")
      
      // If a specific student is requested, check if they're the parent's child
      if (studentId) {
        if (!parent.studentIds.includes(studentId)) {
          return NextResponse.json(
            { message: "Unauthorized to view this student" },
            { status: 401 }
          )
        }
        
        const student = await db.getStudentById(studentId)
        
        if (!student) {
          return NextResponse.json(
            { message: "Student not found" },
            { status: 404 }
          )
        }
        
        return NextResponse.json({ student })
      }
      
      // Otherwise return all their children
      const students = await Promise.all(
        parent.studentIds.map(id => db.getStudentById(id))
      )
      
      return NextResponse.json({ students: students.filter(Boolean) })
    }
    
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  } catch (error) {
    console.error("Error fetching student profile:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching student profile" },
      { status: 500 }
    )
  }
}
