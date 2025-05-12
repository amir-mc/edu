import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get school-wide statistics
    const stats = await db.getSchoolStats()
    
    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching school statistics:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching school statistics" },
      { status: 500 }
    )
  }
}
