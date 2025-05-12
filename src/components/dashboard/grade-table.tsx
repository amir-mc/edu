"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { calculateGradePercentage, getGradeLetter } from "@/lib/utils"

export interface GradeEntry {
  id: string
  assignment: string
  subject: string
  points: number
  maxPoints: number
  feedback?: string
  date: string
}

interface GradeTableProps {
  grades: GradeEntry[]
  showFilters?: boolean
  showFeedback?: boolean
  title?: string
}

export function GradeTable({
  grades,
  showFilters = true,
  showFeedback = true,
  title = "Grades",
}: GradeTableProps) {
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null)

  const uniqueSubjects = useMemo(() => {
    const subjects = new Set<string>()
    grades.forEach((grade) => subjects.add(grade.subject))
    return Array.from(subjects)
  }, [grades])

  const filteredGrades = useMemo(() => {
    if (!subjectFilter) return grades
    return grades.filter((grade) => grade.subject === subjectFilter)
  }, [grades, subjectFilter])

  const overallAverage = useMemo(() => {
    let totalPoints = 0
    let totalMaxPoints = 0

    filteredGrades.forEach((grade) => {
      totalPoints += grade.points
      totalMaxPoints += grade.maxPoints
    })

    const percentage = calculateGradePercentage(totalPoints, totalMaxPoints)
    return {
      percentage,
      letter: getGradeLetter(percentage),
    }
  }, [filteredGrades])

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800"
    if (percentage >= 80) return "bg-blue-100 text-blue-800"
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800"
    if (percentage >= 60) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!subjectFilter ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSubjectFilter(null)}
            >
              All
            </Button>
            {uniqueSubjects.map((subject) => (
              <Button
                key={subject}
                variant={subjectFilter === subject ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSubjectFilter(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Overall Average</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {overallAverage.percentage.toFixed(1)}%
              </span>
              <Badge className={getGradeColor(overallAverage.percentage)}>
                {overallAverage.letter}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Assignments</p>
            <p className="text-2xl font-bold">{filteredGrades.length}</p>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade) => {
                  const percentage = calculateGradePercentage(
                    grade.points,
                    grade.maxPoints
                  )
                  const letter = getGradeLetter(percentage)
                  return (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">
                        <div>
                          {grade.assignment}
                          {showFeedback && grade.feedback && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {grade.feedback}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{grade.subject}</TableCell>
                      <TableCell className="text-right">
                        {grade.points} / {grade.maxPoints}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={getGradeColor(percentage)}>
                          {letter} ({percentage.toFixed(1)}%)
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No grades to display
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
