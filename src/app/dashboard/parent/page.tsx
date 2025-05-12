"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, BookOpen, Users, GraduationCap } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityFeed, ActivityItem } from "@/components/dashboard/activity-feed"
import { GradeTable, GradeEntry } from "@/components/dashboard/grade-table"
import { Calendar, CalendarEvent } from "@/components/dashboard/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Student } from "@/types"

export default function ParentDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [children, setChildren] = useState<(Student & { user: User })[]>([])
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [grades, setGrades] = useState<GradeEntry[]>([])
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        // Fetch children data
        const childrenResponse = await fetch("/api/students/my-children")
        const childrenData = await childrenResponse.json()
        
        if (childrenData.students && childrenData.students.length > 0) {
          setChildren(childrenData.students)
          setSelectedChildId(childrenData.students[0].id)
        }
        
        // Once we have a selectedChildId, fetch child-specific data
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching parent dashboard data:", error)
        setIsLoading(false)
      }
    }
    
    fetchParentData()
  }, [])

  useEffect(() => {
    if (!selectedChildId) return
    
    const fetchChildData = async () => {
      try {
        // Fetch grades for selected child
        const gradesResponse = await fetch(`/api/grades/student/${selectedChildId}`)
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
        const activitiesResponse = await fetch(`/api/students/${selectedChildId}/activities`)
        const activitiesData = await activitiesResponse.json()
        
        if (activitiesData.activities) {
          setActivities(activitiesData.activities)
        }
        
        // Fetch attendance data
        const attendanceResponse = await fetch(`/api/attendance/student/${selectedChildId}`)
        const attendanceData = await attendanceResponse.json()
        
        if (attendanceData.attendance) {
          // Process for attendance chart format
          const processedData = processAttendanceData(attendanceData.attendance)
          setAttendanceData(processedData)
        }
        
        // Fetch calendar events
        const eventsResponse = await fetch(`/api/students/${selectedChildId}/events`)
        const eventsData = await eventsResponse.json()
        
        if (eventsData.events) {
          setEvents(eventsData.events)
        }
      } catch (error) {
        console.error("Error fetching child data:", error)
      }
    }
    
    fetchChildData()
  }, [selectedChildId])

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

  if (children.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Children Found</CardTitle>
            <CardDescription>
              No student accounts are linked to your parent account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please contact your school administrator to link your account with your children's accounts.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Parent Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor your child's academic progress and school activities
          </p>
        </div>
        
        {children.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">View child:</span>
            <select 
              className="rounded-md border p-2 text-sm"
              value={selectedChildId || ""}
              onChange={(e) => setSelectedChildId(e.target.value)}
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.user.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Current Grade Average"
          value={calculateGradeAverage(grades)}
          icon={<GraduationCap className="h-5 w-5" />}
          description="Overall academic performance"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${calculateAttendanceRate(attendanceData)}%`}
          icon={<Users className="h-5 w-5" />}
          description="Present days this semester"
        />
        <StatsCard
          title="Classes"
          value={getChildClasses()}
          icon={<BookOpen className="h-5 w-5" />}
          description="Active course enrollment"
        />
        <StatsCard
          title="Upcoming Events"
          value={getUpcomingEventsCount()}
          icon={<CalendarIcon className="h-5 w-5" />}
          description="In the next 7 days"
        />
      </div>

      <Tabs defaultValue="grades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="grades" className="space-y-4">
          <GradeTable 
            grades={grades} 
            showFilters={true} 
            showFeedback={true}
            title="Academic Performance"
          />
        </TabsContent>
        <TabsContent value="calendar" className="space-y-4">
          <Calendar events={events} />
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <ActivityFeed activities={activities} />
        </TabsContent>
      </Tabs>
    </div>
  )

  // Helper functions
  function calculateGradeAverage(grades: GradeEntry[]): string {
    if (grades.length === 0) return "N/A"
    
    let totalPoints = 0
    let totalMaxPoints = 0
    
    grades.forEach(grade => {
      totalPoints += grade.points
      totalMaxPoints += grade.maxPoints
    })
    
    if (totalMaxPoints === 0) return "N/A"
    
    const percentage = (totalPoints / totalMaxPoints) * 100
    return `${percentage.toFixed(1)}%`
  }

  function calculateAttendanceRate(attendanceData: any[]): string {
    if (attendanceData.length === 0) return "N/A"
    
    let totalPresent = 0
    let totalDays = 0
    
    attendanceData.forEach(day => {
      totalPresent += day.present
      totalDays += day.present + day.absent + day.tardy + day.excused
    })
    
    if (totalDays === 0) return "N/A"
    
    const rate = (totalPresent / totalDays) * 100
    return rate.toFixed(1)
  }

  function getChildClasses(): number | string {
    const selectedChild = children.find(child => child.id === selectedChildId)
    return selectedChild ? selectedChild.classIds.length : "N/A"
  }

  function getUpcomingEventsCount(): number {
    if (events.length === 0) return 0
    
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= today && eventDate <= nextWeek
    }).length
  }
}
