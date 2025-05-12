import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Find the teacher record associated with this user
    const teachers = await db.getTeachers()
    const teacher = teachers.find(t => t.userId === session.user.id)
    
    if (!teacher) {
      return NextResponse.json(
        { message: "Teacher profile not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ teacher })
  } catch (error) {
    console.error("Error fetching teacher profile:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching teacher profile" },
      { status: 500 }
    )
  }
}
