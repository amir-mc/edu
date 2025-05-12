import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Query parameters
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    
    // Get all attendance records
    let attendance = await db.getAttendance()
    
    // Filter by date range if specified
    if (startDate || endDate) {
      attendance = attendance.filter(record => {
        const recordDate = new Date(record.date)
        
        if (startDate && new Date(startDate) > recordDate) {
          return false
        }
        
        if (endDate && new Date(endDate) < recordDate) {
          return false
        }
        
        return true
      })
    }
    
    return NextResponse.json({ attendance })
  } catch (error) {
    console.error("Error fetching school attendance:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching attendance" },
      { status: 500 }
    )
  }
}
