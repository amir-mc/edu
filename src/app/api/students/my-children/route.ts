import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "parent") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Find the parent record associated with this user
    const parents = await db.getParents()
    const parent = parents.find(p => p.userId === session.user.id)
    
    if (!parent) {
      return NextResponse.json(
        { message: "Parent profile not found" },
        { status: 404 }
      )
    }
    
    // Get all their children
    const students = await Promise.all(
      parent.studentIds.map(id => db.getStudentById(id))
    )
    
    // Filter out any null values (in case a student ID no longer exists)
    const validStudents = students.filter(Boolean)
    
    return NextResponse.json({ students: validStudents })
  } catch (error) {
    console.error("Error fetching children:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching children" },
      { status: 500 }
    )
  }
}
