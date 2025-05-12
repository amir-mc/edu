import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Query parameters
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")
    const studentId = searchParams.get("studentId")
    
    let classes
    
    if (teacherId) {
      classes = await db.getClassesByTeacherId(teacherId)
    } else if (studentId) {
      classes = await db.getClassesByStudentId(studentId)
    } else {
      // Only principals can view all classes
      if (session.user.role !== "principal") {
        return NextResponse.json(
          { message: "Unauthorized to view all classes" },
          { status: 401 }
        )
      }
      classes = await db.getClasses()
    }
    
    return NextResponse.json({ classes })
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching classes" },
      { status: 500 }
    )
  }
}
