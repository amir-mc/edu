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
    
    // Check if user is authorized to view this student's attendance
    if (session.user.role === "parent") {
      // Verify the student is this parent's child
      const parents = await db.getParents()
      const parent = parents.find(p => p.userId === session.user.id)
      
      if (!parent || !parent.studentIds.includes(studentId)) {
        return NextResponse.json(
          { message: "Unauthorized to view this student's attendance" },
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
          { message: "Unauthorized to view this student's attendance" },
          { status: 401 }
        )
      }
    } else if (session.user.role === "student") {
      // Students can only see their own attendance
      const students = await db.getStudents()
      const student = students.find(s => s.userId === session.user.id)
      
      if (!student || student.id !== studentId) {
        return NextResponse.json(
          { message: "Unauthorized to view this student's attendance" },
          { status: 401 }
        )
      }
    } else if (session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized to view student attendance" },
        { status: 401 }
      )
    }
    
    // Get attendance records for this student
    const attendance = await db.getAttendanceByStudentId(studentId)
    
    // Query parameters
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const date = searchParams.get("date")
    
    // Apply filters
    let filteredAttendance = attendance
    
    if (classId) {
      filteredAttendance = filteredAttendance.filter(record => 
        record.classId === classId
      )
    }
    
    if (date) {
      filteredAttendance = filteredAttendance.filter(record => 
        record.date.startsWith(date)
      )
    }
    
    return NextResponse.json({ attendance: filteredAttendance })
  } catch (error) {
    console.error("Error fetching student attendance:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching attendance" },
      { status: 500 }
    )
  }
}
