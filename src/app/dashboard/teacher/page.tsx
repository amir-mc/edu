"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileText 
} from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityFeed, ActivityItem } from "@/components/dashboard/activity-feed"
import { AssignmentList, Assignment } from "@/components/dashboard/assignment-list"
import { GradeTable, GradeEntry } from "@/components/dashboard/grade-table"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Teacher, Class, Student, User } from "@/types"

export default function TeacherDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [students, setStudents] = useState<(Student & { user: User })[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [grades, setGrades] = useState<GradeEntry[]>([])
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Fetch teacher profile data
        const teacherResponse = await fetch("/api/teachers/profile")
        const teacherData = await teacherResponse.json()
        
        if (teacherData.teacher) {
          setTeacher(teacherData.teacher)
        }
        
        // Fetch classes taught by this teacher
        const classesResponse = await fetch("/api/classes/my-classes")
        const classesData = await classesResponse.json()
        
        if (classesData.classes && classesData.classes.length > 0) {
          setClasses(classesData.classes)
          setSelectedClassId(classesData.classes[0].id)
        }
        
        // Fetch activities
        const activitiesResponse = await fetch("/api/teachers/activities")
        const activitiesData = await activitiesResponse.json()
        
        if (activitiesData.activities) {
          setActivities(activitiesData.activities)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching teacher dashboard data:", error)
        setIsLoading(false)
      }
    }
    
    fetchTeacherData()
  }, [])

  useEffect(() => {
    if (!selectedClassId) return
    
    const fetchClassData = async () => {
      try {
        // Fetch students in the selected class
        const studentsResponse = await fetch(`/api/classes/${selectedClassId}/students`)
        const studentsData = await studentsResponse.json()
        
        if (studentsData.students) {
          setStudents(studentsData.students)
        }
        
        // Fetch assignments for the selected class
        const assignmentsResponse = await fetch(`/api/classes/${selectedClassId}/assignments`)
        const assignmentsData = await assignmentsResponse.json()
        
        if (assignmentsData.assignments) {
          setAssignments(assignmentsData.assignments.map((assignment: any) => ({
            id: assignment.id,
            title: assignment.title,
            subject: assignment.className,
            description: assignment.description,
            dueDate: assignment.dueDate,
            status: assignment.status
          })))
        }
        
        // Fetch grades for the selected class
        const gradesResponse = await fetch(`/api/classes/${selectedClassId}/grades`)
        const gradesData = await gradesResponse.json()
        
        if (gradesData.grades) {
          setGrades(gradesData.grades.map((grade: any) => ({
            id: grade.id,
            assignment: grade.assignmentTitle,
            subject: grade.subject,
            points: grade.points,
            maxPoints: grade.maxPoints,
            feedback: grade.feedback,
            date: grade.createdAt
          })))
        }
        
        // Fetch attendance data for the selected class
        const attendanceResponse = await fetch(`/api/classes/${selectedClassId}/attendance`)
        const attendanceData = await attendanceResponse.json()
        
        if (attendanceData.attendance) {
          // Process for attendance chart format
          const processedData = processAttendanceData(attendanceData.attendance)
          setAttendanceData(processedData)
        }
      } catch (error) {
        console.error("Error fetching class data:", error)
      }
    }
    
    fetchClassData()
  }, [selectedClassId])

  // Helper function to process attendance data for the chart
  const processAttendanceData = (attendance: any[]) => {
    // Group attendance by date
    const groupedByDate = attendance.reduce((acc: any, record: any) => {
      const date = record.date.split('T')[0]
      
      if (!acc[date]) {
        acc[date] = {
          date,
          present: 0,
          absent: 0,
          tardy: 0,
          excused: 0
        }
      }
      
      // Increment the appropriate status count
      acc[date][record.status] += 1
      
      return acc
    }, {})
    
    // Convert the object to an array
    return Object.values(groupedByDate)
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const selectedClass = classes.find(c => c.id === selectedClassId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your classes, assignments, and student progress
          </p>
        </div>
        
        {classes.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">View class:</span>
            <select 
              className="rounded-md border p-2 text-sm"
              value={selectedClassId || ""}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedClass ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Students"
              value={students.length}
              icon={<Users className="h-5 w-5" />}
              description={`Enrolled in ${selectedClass.name}`}
            />
            <StatsCard
              title="Class Average"
              value={`${calculateClassAverage(grades)}%`}
              icon={<GraduationCap className="h-5 w-5" />}
              description="Overall class performance"
            />
            <StatsCard
              title="Assignments"
              value={assignments.length}
              icon={<FileText className="h-5 w-5" />}
              description="Total class assignments"
            />
            <StatsCard
              title="Attendance"
              value={`${calculateAttendanceRate(attendanceData)}%`}
              icon={<Users className="h-5 w-5" />}
              description="Average attendance rate"
            />
          </div>

          <Tabs defaultValue="students" className="space-y-4">
            <TabsList>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>
            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Class Roster</CardTitle>
                    <CardDescription>
                      Students enrolled in {selectedClass.name}
                    </CardDescription>
                  </div>
                  <Button>Add Student</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.length > 0 ? (
                      students.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              {student.user.avatarUrl ? (
                                <AvatarImage src={student.user.avatarUrl} alt={student.user.name} />
                              ) : (
                                <AvatarFallback>{getInitials(student.user.name)}</AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Grade: {student.grade}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge>
                              {calculateStudentGrade(student.id, grades)}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-sm text-muted-foreground">
                          No students enrolled in this class
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="assignments" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Assignments</CardTitle>
                    <CardDescription>
                      Manage assignments for {selectedClass.name}
                    </CardDescription>
                  </div>
                  <Button>Create Assignment</Button>
                </CardHeader>
                <CardContent>
                  <AssignmentList assignments={assignments} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="grades" className="space-y-4">
              <GradeTable grades={grades} />
            </TabsContent>
            <TabsContent value="attendance" className="space-y-4">
              <AttendanceChart 
                data={attendanceData} 
                title={`Attendance for ${selectedClass.name}`}
              />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Classes Found</CardTitle>
            <CardDescription>
              You currently don't have any assigned classes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Contact your school administrator to assign classes to your account.
            </p>
            <Button>Request Class Assignment</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeed activities={activities} />
        </CardContent>
      </Card>
    </div>
  )

  // Helper functions
  function calculateClassAverage(grades: GradeEntry[]): string {
    if (grades.length === 0) return "0"
    
    let totalPoints = 0
    let totalMaxPoints = 0
    
    grades.forEach(grade => {
      totalPoints += grade.points
      totalMaxPoints += grade.maxPoints
    })
    
    if (totalMaxPoints === 0) return "0"
    
    const percentage = (totalPoints / totalMaxPoints) * 100
    return percentage.toFixed(1)
  }

  function calculateStudentGrade(studentId: string, grades: GradeEntry[]): string {
    // Filter grades for this student
    // In a real application, we would have student IDs in the grade entries
    // For this demo, we'll just return a sample grade
    return "A"
  }

  function calculateAttendanceRate(attendanceData: any[]): string {
    if (attendanceData.length === 0) return "0"
    
    let totalPresent = 0
    let totalDays = 0
    
    attendanceData.forEach(day => {
      totalPresent += day.present
      totalDays += day.present + day.absent + day.tardy + day.excused
    })
    
    if (totalDays === 0) return "0"
    
    const rate = (totalPresent / totalDays) * 100
    return rate.toFixed(1)
  }
}
