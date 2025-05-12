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
    } else if (session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized to view class students" },
        { status: 401 }
      )
    }
    
    // Get the class
    const classRecord = await db.getClassById(classId)
    
    if (!classRecord) {
      return NextResponse.json(
        { message: "Class not found" },
        { status: 404 }
      )
    }
    
    // Get students in this class
    const students = await db.getStudentsByClassId(classId)
    
    return NextResponse.json({ students })
  } catch (error) {
    console.error("Error fetching class students:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching class students" },
      { status: 500 }
    )
  }
}
