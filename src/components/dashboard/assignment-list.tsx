"use client"

import { useMemo, useState } from "react"
import { CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

export interface Assignment {
  id: string
  title: string
  subject: string
  description: string
  dueDate: string
  status: "upcoming" | "completed" | "overdue" | "in-progress"
}

interface AssignmentListProps {
  assignments: Assignment[]
  showFilters?: boolean
  onAssignmentClick?: (assignment: Assignment) => void
}

export function AssignmentList({
  assignments,
  showFilters = true,
  onAssignmentClick,
}: AssignmentListProps) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredAssignments = useMemo(() => {
    if (!statusFilter) return assignments
    return assignments.filter((assignment) => assignment.status === statusFilter)
  }, [assignments, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Assignments</CardTitle>
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!statusFilter ? "secondary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(null)}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "upcoming" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              variant={statusFilter === "completed" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
            <Button
              variant={statusFilter === "overdue" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("overdue")}
            >
              Overdue
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex flex-col rounded-lg border p-4 hover:bg-muted/50 cursor-pointer"
                onClick={() => onAssignmentClick?.(assignment)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {assignment.subject}
                    </p>
                  </div>
                  <Badge className={getStatusColor(assignment.status)}>
                    {assignment.status.charAt(0).toUpperCase() +
                      assignment.status.slice(1)}
                  </Badge>
                </div>
                <p className="mt-2 text-sm">{assignment.description}</p>
                <div className="mt-3 flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  Due: {formatDate(assignment.dueDate)}
                  {isDueSoon(assignment.dueDate) &&
                    assignment.status === "upcoming" && (
                      <Badge
                        variant="outline"
                        className="ml-2 border-red-200 bg-red-100 text-red-800"
                      >
                        Due Soon
                      </Badge>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-[100px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-center text-sm text-muted-foreground">
                No assignments found
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
