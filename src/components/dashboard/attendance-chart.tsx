"use client"

import { useEffect, useState } from "react"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface AttendanceRecord {
  date: string
  present: number
  absent: number
  tardy: number
  excused: number
}

interface AttendanceChartProps {
  title?: string
  data: AttendanceRecord[]
  showFilter?: boolean
}

export function AttendanceChart({
  title = "Attendance Overview",
  data,
  showFilter = true,
}: AttendanceChartProps) {
  const [chartData, setChartData] = useState(data)
  const [filter, setFilter] = useState("weekly")

  useEffect(() => {
    // In a real application, we would filter the data based on the selected timeframe
    // For this demo, we'll just use the provided data
    setChartData(data)
  }, [data, filter])

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {showFilter && (
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="quarterly">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => {
                  return [value, name.charAt(0).toUpperCase() + name.slice(1)]
                }}
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                }}
              />
              <Legend />
              <Bar dataKey="present" stackId="a" fill="#4ade80" name="Present" />
              <Bar dataKey="absent" stackId="a" fill="#f87171" name="Absent" />
              <Bar dataKey="tardy" stackId="a" fill="#fbbf24" name="Tardy" />
              <Bar dataKey="excused" stackId="a" fill="#60a5fa" name="Excused" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
