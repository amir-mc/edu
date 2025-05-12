"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  BookOpen,
  BarChart
} from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityFeed, ActivityItem } from "@/components/dashboard/activity-feed"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Gradeentry } from "@/components/dashboard/grade-table"
import { SchoolStats } from "@/types"

export default function PrincipalDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [schoolStats, setSchoolStats] = useState<SchoolStats | null>(null)
  const [classPerformance, setClassPerformance] = useState<any[]>([])
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [teacherStats, setTeacherStats] = useState<any[]>([])

  useEffect(() => {
    const fetchPrincipalData = async () => {
      try {
        // Fetch school statistics
        const statsResponse = await fetch("/api/school/stats")
        const statsData = await statsResponse.json()
        
        if (statsData.stats) {
          setSchoolStats(statsData.stats)
        }
        
        // Fetch class performance data
        const classesResponse = await fetch("/api/school/classes/performance")
        const classesData = await classesResponse.json()
        
        if (classesData.classes) {
          setClassPerformance(classesData.classes)
        }
        
        // Fetch school-wide attendance data
        const attendanceResponse = await fetch("/api/school/attendance")
        const attendanceData = await attendanceResponse.json()
        
        if (attendanceData.attendance) {
          // Process for attendance chart format
          const processedData = processAttendanceData(attendanceData.attendance)
          setAttendanceData(processedData)
        }
        
        // Fetch activities
        const activitiesResponse = await fetch("/api/principals/activities")
        const activitiesData = await activitiesResponse.json()
        
        if (activitiesData.activities) {
          setActivities(activitiesData.activities)
        }
        
        // Fetch teacher statistics
        const teachersResponse = await fetch("/api/school/teachers/stats")
        const teachersData = await teachersResponse.json()
        
        if (teachersData.teachers) {
          setTeacherStats(teachersData.teachers)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching principal dashboard data:", error)
        setIsLoading(false)
      }
    }
    
    fetchPrincipalData()
  }, [])

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Principal Dashboard</h2>
        <p className="text-muted-foreground">
          School-wide analytics and oversight
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={schoolStats?.totalStudents || 0}
          icon={<Users className="h-5 w-5" />}
          description="Enrolled school-wide"
        />
        <StatsCard
          title="Total Teachers"
          value={schoolStats?.totalTeachers || 0}
          icon={<UserCheck className="h-5 w-5" />}
          description="Faculty members"
        />
        <StatsCard
          title="Average Grade"
          value={`${schoolStats?.averageGrade.toFixed(1) || 0}%`}
          icon={<GraduationCap className="h-5 w-5" />}
          description="School-wide average"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${schoolStats?.averageAttendance.toFixed(1) || 0}%`}
          icon={<UserCheck className="h-5 w-5" />}
          description="School-wide attendance"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>
              Academic performance across all classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {classPerformance.length > 0 ? (
                classPerformance.map((classItem) => (
                  <div key={classItem.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{classItem.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Teacher: {classItem.teacherName}
                        </div>
                      </div>
                      <div className="text-sm font-medium">{classItem.averageGrade}%</div>
                    </div>
                    <Progress value={classItem.averageGrade} className="h-2" />
                  </div>
                ))
              ) : (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    No class performance data available
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
              Latest updates school-wide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={activities.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="teachers">Faculty</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance" className="space-y-4">
          <AttendanceChart 
            data={attendanceData} 
            title="School-wide Attendance"
          />
        </TabsContent>
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Performance</CardTitle>
              <CardDescription>
                Class management and student outcomes by teacher
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {teacherStats.length > 0 ? (
                  teacherStats.map((teacher) => (
                    <div key={teacher.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{teacher.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Classes: {teacher.classCount} | Students: {teacher.studentCount}
                          </div>
                        </div>
                        <div className="text-sm font-medium">{teacher.averageClassGrade}%</div>
                      </div>
                      <Progress value={teacher.averageClassGrade} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">
                      No teacher performance data available
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>
                Academic performance by subject area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Mathematics</div>
                    <div className="text-sm font-medium">85.7%</div>
                  </div>
                  <Progress value={85.7} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Science</div>
                    <div className="text-sm font-medium">82.3%</div>
                  </div>
                  <Progress value={82.3} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Language Arts</div>
                    <div className="text-sm font-medium">78.9%</div>
                  </div>
                  <Progress value={78.9} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Social Studies</div>
                    <div className="text-sm font-medium">81.2%</div>
                  </div>
                  <Progress value={81.2} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
