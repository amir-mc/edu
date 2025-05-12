import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

// Get all attendance records (principal only)
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
    const studentId = searchParams.get("studentId")
    const classId = searchParams.get("classId")
    const date = searchParams.get("date")
    
    let attendance
    
    if (studentId) {
      attendance = await db.getAttendanceByStudentId(studentId)
    } else if (classId) {
      attendance = await db.getAttendanceByClassId(classId)
    } else {
      attendance = await db.getAttendance()
    }
    
    // Filter by date if specified
    if (date) {
      attendance = attendance.filter(record => record.date.startsWith(date))
    }
    
    return NextResponse.json({ attendance })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching attendance" },
      { status: 500 }
    )
  }
}

// Create attendance records (teachers only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const attendanceData = await request.json()
    
    if (!attendanceData.studentId || !attendanceData.classId || !attendanceData.date || !attendanceData.status) {
      return NextResponse.json(
        { message: "Student ID, class ID, date, and status are required" },
        { status: 400 }
      )
    }
    
    // Verify the status is valid
    const validStatuses = ['present', 'absent', 'tardy', 'excused']
    if (!validStatuses.includes(attendanceData.status)) {
      return NextResponse.json(
        { message: "Invalid status. Must be one of: present, absent, tardy, excused" },
        { status: 400 }
      )
    }
    
    // Verify the teacher teaches this class
    const teachers = await db.getTeachers()
    const teacher = teachers.find(t => t.userId === session.user.id)
    
    if (!teacher || !teacher.classIds.includes(attendanceData.classId)) {
      return NextResponse.json(
        { message: "Unauthorized to record attendance for this class" },
        { status: 401 }
      )
    }
    
    // Create the attendance record
    const newAttendance = await db.createAttendance({
      studentId: attendanceData.studentId,
      classId: attendanceData.classId,
      date: attendanceData.date,
      status: attendanceData.status
    })
    
    return NextResponse.json({ 
      message: "Attendance recorded successfully", 
      attendance: newAttendance 
    })
  } catch (error) {
    console.error("Error recording attendance:", error)
    return NextResponse.json(
      { message: "An error occurred while recording attendance" },
      { status: 500 }
    )
  }
}
