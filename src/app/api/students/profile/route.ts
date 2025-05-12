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
    
    return NextResponse.json(
      { message: "Not a student account" },
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
