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
    } else if (session.user.role === "parent") {
      // Parents can only see their children's classes
      const parents = await db.getParents()
      const parent = parents.find(p => p.userId === session.user.id)
      
      if (!parent) {
        return NextResponse.json(
          { message: "Parent profile not found" },
          { status: 404 }
        )
      }
      
      // Check if any of their children are in this class
      const children = await Promise.all(
        parent.studentIds.map(id => db.getStudentById(id))
      )
      
      const childInClass = children.some(child => 
        child && child.classIds.includes(classId)
      )
      
      if (!childInClass) {
        return NextResponse.json(
          { message: "Unauthorized to view this class" },
          { status: 401 }
        )
      }
    } else if (session.user.role !== "principal") {
      return NextResponse.json(
        { message: "Unauthorized to view class attendance" },
        { status: 401 }
      )
    }
    
    // Get the class to ensure it exists
    const classRecord = await db.getClassById(classId)
    
    if (!classRecord) {
      return NextResponse.json(
        { message: "Class not found" },
        { status: 404 }
      )
    }
    
    // Get attendance records for this class
    const attendance = await db.getAttendanceByClassId(classId)
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const studentId = searchParams.get("studentId")
    
    // Apply filters
    let filteredAttendance = attendance
    
    if (date) {
      filteredAttendance = filteredAttendance.filter(record => 
        record.date.startsWith(date)
      )
    }
    
    if (studentId) {
      filteredAttendance = filteredAttendance.filter(record => 
        record.studentId === studentId
      )
    }
    
    // If user is a student, only show their attendance
    if (session.user.role === "student") {
      const students = await db.getStudents()
      const student = students.find(s => s.userId === session.user.id)
      
      if (student) {
        filteredAttendance = filteredAttendance.filter(record => 
          record.studentId === student.id
        )
      }
    }
    
    // If user is a parent, only show their children's attendance
    if (session.user.role === "parent") {
      const parents = await db.getParents()
      const parent = parents.find(p => p.userId === session.user.id)
      
      if (parent) {
        filteredAttendance = filteredAttendance.filter(record => 
          parent.studentIds.includes(record.studentId)
        )
      }
    }
    
    return NextResponse.json({ attendance: filteredAttendance })
  } catch (error) {
    console.error("Error fetching class attendance:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching class attendance" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const classId = params.id
    
    // Verify the teacher teaches this class
    const teachers = await db.getTeachers()
    const teacher = teachers.find(t => t.userId === session.user.id)
    
    if (!teacher || !teacher.classIds.includes(classId)) {
      return NextResponse.json(
        { message: "Unauthorized to record attendance for this class" },
        { status: 401 }
      )
    }
    
    // Get the attendance data
    const attendanceData = await request.json()
    
    if (!Array.isArray(attendanceData.records)) {
      return NextResponse.json(
        { message: "Records array is required" },
        { status: 400 }
      )
    }
    
    // Validate each record
    for (const record of attendanceData.records) {
      if (!record.studentId || !record.date || !record.status) {
        return NextResponse.json(
          { message: "Each record must have studentId, date, and status" },
          { status: 400 }
        )
      }
      
      // Verify the status is valid
      const validStatuses = ['present', 'absent', 'tardy', 'excused']
      if (!validStatuses.includes(record.status)) {
        return NextResponse.json(
          { message: "Invalid status. Must be one of: present, absent, tardy, excused" },
          { status: 400 }
        )
      }
      
      // Verify the student is in this class
      const classRecord = await db.getClassById(classId)
      
      if (!classRecord.studentIds.includes(record.studentId)) {
        return NextResponse.json(
          { message: `Student ${record.studentId} is not in this class` },
          { status: 400 }
        )
      }
    }
    
    // Create the attendance records
    const createdRecords = []
    for (const record of attendanceData.records) {
      const newAttendance = await db.createAttendance({
        studentId: record.studentId,
        classId,
        date: record.date,
        status: record.status
      })
      
      createdRecords.push(newAttendance)
    }
    
    return NextResponse.json({ 
      message: "Attendance recorded successfully", 
      attendance: createdRecords 
    })
  } catch (error) {
    console.error("Error recording attendance:", error)
    return NextResponse.json(
      { message: "An error occurred while recording attendance" },
      { status: 500 }
    )
  }
}
