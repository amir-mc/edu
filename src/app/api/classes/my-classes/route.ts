import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    let classes
    
    if (session.user.role === "teacher") {
      // Find the teacher record associated with this user
      const teachers = await db.getTeachers()
      const teacher = teachers.find(t => t.userId === session.user.id)
      
      if (!teacher) {
        return NextResponse.json(
          { message: "Teacher profile not found" },
          { status: 404 }
        )
      }
      
      classes = await Promise.all(
        teacher.classIds.map(id => db.getClassById(id))
      )
    } else if (session.user.role === "student") {
      // Find the student record associated with this user
      const students = await db.getStudents()
      const student = students.find(s => s.userId === session.user.id)
      
      if (!student) {
        return NextResponse.json(
          { message: "Student profile not found" },
          { status: 404 }
        )
      }
      
      classes = await Promise.all(
        student.classIds.map(id => db.getClassById(id))
      )
    } else if (session.user.role === "principal") {
      // Principals can see all classes
      classes = await db.getClasses()
    } else {
      return NextResponse.json(
        { message: "Unauthorized to view classes" },
        { status: 401 }
      )
    }
    
    // Filter out any null values (in case a class ID no longer exists)
    const validClasses = (classes || []).filter(Boolean)
    
    return NextResponse.json({ classes: validClasses })
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching classes" },
      { status: 500 }
    )
  }
}
