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
    
    // Get all classes
    const classes = await db.getClasses()
    
    // For each class, get performance data
    const classPerformance = await Promise.all(
      classes.map(async (classRecord) => {
        // Get the teacher
        const teacher = await db.getTeacherById(classRecord.teacherId)
        const teacherUser = teacher ? await db.getUserById(teacher.userId) : null
        
        // Get all assignments for this class
        const assignments = await db.getAssignmentsByClassId(classRecord.id)
        
        // Get all grades for all assignments in this class
        let allGrades = []
        for (const assignment of assignments) {
          const grades = await db.getGradesByAssignmentId(assignment.id)
          allGrades.push(...grades)
        }
        
        // Calculate average grade
        let totalPoints = 0
        let totalMaxPoints = 0
        
        allGrades.forEach(grade => {
          totalPoints += grade.points
          totalMaxPoints += assignments.find(a => a.id === grade.assignmentId)?.maxPoints || 0
        })
        
        const averageGrade = totalMaxPoints > 0 
          ? (totalPoints / totalMaxPoints) * 100 
          : 0
        
        return {
          id: classRecord.id,
          name: classRecord.name,
          subject: classRecord.subject,
          teacherId: classRecord.teacherId,
          teacherName: teacherUser ? teacherUser.name : "Unknown",
          studentCount: classRecord.studentIds.length,
          assignmentCount: assignments.length,
          averageGrade: averageGrade.toFixed(1)
        }
      })
    )
    
    return NextResponse.json({ classes: classPerformance })
  } catch (error) {
    console.error("Error fetching class performance:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching class performance" },
      { status: 500 }
    )
  }
}
