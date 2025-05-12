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
        { message: "Unauthorized to view class assignments" },
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
    
    // Get assignments for this class
    const assignments = await db.getAssignmentsByClassId(classId)
    
    // For the demo, we'll add some mock assignments with status
    const assignmentsWithStatus = assignments.map(assignment => {
      // In a real app, we would determine status based on submissions, due date, etc.
      let status = "upcoming"
      const dueDate = new Date(assignment.dueDate)
      const now = new Date()
      
      if (dueDate < now) {
        // Assignment is past due
        status = Math.random() > 0.5 ? "completed" : "overdue"
      } else if (dueDate.getTime() - now.getTime() < 86400000 * 3) {
        // Due in less than 3 days
        status = Math.random() > 0.3 ? "in-progress" : "upcoming"
      }
      
      return {
        ...assignment,
        status,
        className: classRecord.name, // Add class name for context
      }
    })
    
    return NextResponse.json({ assignments: assignmentsWithStatus })
  } catch (error) {
    console.error("Error fetching class assignments:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching class assignments" },
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
        { message: "Unauthorized to create assignments for this class" },
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
    
    // Get the assignment data
    const assignmentData = await request.json()
    
    if (!assignmentData.title || !assignmentData.dueDate) {
      return NextResponse.json(
        { message: "Title and due date are required" },
        { status: 400 }
      )
    }
    
    // Create the assignment
    const newAssignment = await db.createAssignment({
      title: assignmentData.title,
      description: assignmentData.description || "",
      classId,
      dueDate: assignmentData.dueDate,
      maxPoints: assignmentData.maxPoints || 100
    })
    
    return NextResponse.json({ 
      message: "Assignment created successfully", 
      assignment: newAssignment 
    })
  } catch (error) {
    console.error("Error creating assignment:", error)
    return NextResponse.json(
      { message: "An error occurred while creating assignment" },
      { status: 500 }
    )
  }
}
