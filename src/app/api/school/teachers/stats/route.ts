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
    
    // Get all teachers
    const teachers = await db.getTeachers()
    
    // For each teacher, get performance data
    const teacherStats = await Promise.all(
      teachers.map(async (teacher) => {
        // Get the teacher user
        const teacherUser = await db.getUserById(teacher.userId)
        
        if (!teacherUser) {
          return null
        }
        
        // Get classes taught by this teacher
        const classes = await db.getClassesByTeacherId(teacher.id)
        
        // Calculate total student count
        const studentIdsSet = new Set()
        classes.forEach(classRecord => {
          classRecord.studentIds.forEach(id => studentIdsSet.add(id))
        })
        
        // Calculate class grades
        let allClassGrades = []
        
        for (const classRecord of classes) {
          // Get all assignments for this class
          const assignments = await db.getAssignmentsByClassId(classRecord.id)
          
          // Get all grades for all assignments in this class
          let classGrades = []
          for (const assignment of assignments) {
            const grades = await db.getGradesByAssignmentId(assignment.id)
            classGrades.push(...grades.map(grade => ({
              ...grade,
              maxPoints: assignment.maxPoints
            })))
          }
          
          allClassGrades.push(...classGrades)
        }
        
        // Calculate average grade
        let totalPoints = 0
        let totalMaxPoints = 0
        
        allClassGrades.forEach(grade => {
          totalPoints += grade.points
          totalMaxPoints += grade.maxPoints || 0
        })
        
        const averageClassGrade = totalMaxPoints > 0 
          ? (totalPoints / totalMaxPoints) * 100 
          : 0
        
        return {
          id: teacher.id,
          name: teacherUser.name,
          email: teacherUser.email,
          classCount: classes.length,
          studentCount: studentIdsSet.size,
          subjectCount: new Set(teacher.subjectIds).size,
          averageClassGrade: averageClassGrade.toFixed(1)
        }
      })
    )
    
    // Filter out any null values
    const validTeacherStats = teacherStats.filter(Boolean)
    
    return NextResponse.json({ teachers: validTeacherStats })
  } catch (error) {
    console.error("Error fetching teacher statistics:", error)
    return NextResponse.json(
      { message: "An error occurred while fetching teacher statistics" },
      { status: 500 }
    )
  }
}
