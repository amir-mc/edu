"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, BookOpen, Award, FileText } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityFeed, ActivityItem } from "@/components/dashboard/activity-feed"
import { AssignmentList, Assignment } from "@/components/dashboard/assignment-list"
import { GradeTable, GradeEntry } from "@/components/dashboard/grade-table"
import { Calendar, CalendarEvent } from "@/components/dashboard/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Student, Class } from "@/types"

export default function StudentDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [student, setStudent] = useState<Student | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([])
  const [grades, setGrades] = useState<GradeEntry[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Fetch student profile data
        const studentResponse = await fetch("/api/students/profile")
        const studentData = await studentResponse.json()
        
        if (studentData.student) {
          setStudent(studentData.student)
        }
        
        // Fetch classes
        const classesResponse = await fetch("/api/classes/my-classes")
        const classesData = await classesResponse.json()
        
        if (classesData.classes) {
          setClasses(classesData.classes)
        }
        
        // Fetch assignments
        const assignmentsResponse = await fetch("/api/assignments/my-assignments")
        const assignmentsData = await assignmentsResponse.json()
        
        if (assignmentsData.assignments) {
          const allAssignments = assignmentsData.assignments.map((assignment: any) => ({
            id: assignment.id,
            title: assignment.title,
            subject: assignment.className,
            description: assignment.description,
            dueDate: assignment.dueDate,
            status: assignment.status
          }))
          
          setAssignments(allAssignments)
          
          // Filter upcoming assignments
          const upcoming = allAssignments.filter((a: Assignment) => 
            a.status === "upcoming" || a.status === "in-progress"
          )
          setUpcomingAssignments(upcoming)
        }
        
        // Fetch grades
        const gradesResponse = await fetch("/api/grades/my-grades")
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
        
        // Fetch activities
        const activitiesResponse = await fetch("/api/students/activities")
        const activitiesData = await activitiesResponse.json()
        
        if (activitiesData.activities) {
          setActivities(activitiesData.activities)
        }
        
        // Fetch calendar events
        const eventsResponse = await fetch("/api/students/events")
        const eventsData = await eventsResponse.json()
        
        if (eventsData.events) {
          setEvents(eventsData.events)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching student dashboard data:", error)
        setIsLoading(false)
      }
    }
    
    fetchStudentData()
  }, [])

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Student Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your courses.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="GPA"
          value={calculateGPA(grades)}
          icon={<Award className="h-5 w-5" />}
          description="Current grade point average"
        />
        <StatsCard
          title="Courses"
          value={classes.length}
          icon={<BookOpen className="h-5 w-5" />}
          description="Active course enrollment"
        />
        <StatsCard
          title="Assignments"
          value={`${getCompletedAssignmentsCount()}/${assignments.length}`}
          icon={<FileText className="h-5 w-5" />}
          description="Completed assignments"
        />
        <StatsCard
          title="Upcoming"
          value={upcomingAssignments.length}
          icon={<CalendarIcon className="h-5 w-5" />}
          description="Due assignments"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Your Classes</CardTitle>
            <CardDescription>
              Track your progress across all courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {classes.length > 0 ? (
                classes.map((classItem) => {
                  const classGrades = grades.filter(
                    (grade) => grade.subject === classItem.subject
                  )
                  const average = calculateClassAverage(classGrades)
                  
                  return (
                    <div key={classItem.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{classItem.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {classItem.subject}
                          </div>
                        </div>
                        <div className="text-sm font-medium">{average}%</div>
                      </div>
                      <Progress value={parseFloat(average)} className="h-2" />
                    </div>
                  )
                })
              ) : (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    No classes found
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={activities.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="assignments" className="space-y-4">
          <AssignmentList assignments={assignments} />
        </TabsContent>
        <TabsContent value="grades" className="space-y-4">
          <GradeTable grades={grades} />
        </TabsContent>
        <TabsContent value="calendar" className="space-y-4">
          <Calendar events={events} />
        </TabsContent>
      </Tabs>
    </div>
  )

  // Helper functions
  function calculateGPA(grades: GradeEntry[]): string {
    if (grades.length === 0) return "N/A"
    
    let totalPoints = 0
    let totalMaxPoints = 0
    
    grades.forEach(grade => {
      totalPoints += grade.points
      totalMaxPoints += grade.maxPoints
    })
    
    if (totalMaxPoints === 0) return "N/A"
    
    const percentage = (totalPoints / totalMaxPoints) * 100
    
    // Simple GPA calculation (4.0 scale)
    let gpa
    if (percentage >= 90) gpa = 4.0
    else if (percentage >= 80) gpa = 3.0
    else if (percentage >= 70) gpa = 2.0
    else if (percentage >= 60) gpa = 1.0
    else gpa = 0.0
    
    return gpa.toFixed(1)
  }

  function calculateClassAverage(classGrades: GradeEntry[]): string {
    if (classGrades.length === 0) return "0"
    
    let totalPoints = 0
    let totalMaxPoints = 0
    
    classGrades.forEach(grade => {
      totalPoints += grade.points
      totalMaxPoints += grade.maxPoints
    })
    
    if (totalMaxPoints === 0) return "0"
    
    const percentage = (totalPoints / totalMaxPoints) * 100
    return percentage.toFixed(1)
  }

  function getCompletedAssignmentsCount(): number {
    return assignments.filter(a => a.status === "completed").length
  }
}
