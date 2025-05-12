"use client"

import { useState } from "react"
import { 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time?: string
  type: 'class' | 'assignment' | 'exam' | 'event'
  description?: string
}

interface CalendarProps {
  events: CalendarEvent[]
}

export function Calendar({ events }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
    setSelectedDate(null)
  }

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
    setSelectedDate(null)
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(newDate)
  }

  // Filter events for the selected date
  const selectedDateEvents = selectedDate
    ? events.filter((event) => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    : []

  // Check if a date has events
  const hasEvents = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0]
    return events.some((event) => event.date.startsWith(date))
  }

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-500'
      case 'assignment':
        return 'bg-green-500'
      case 'exam':
        return 'bg-red-500'
      case 'event':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Format date to readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Calendar</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-7 gap-1 text-center text-xs font-medium">
          <div className="py-1">Sun</div>
          <div className="py-1">Mon</div>
          <div className="py-1">Tue</div>
          <div className="py-1">Wed</div>
          <div className="py-1">Thu</div>
          <div className="py-1">Fri</div>
          <div className="py-1">Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square p-1" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === currentDate.getMonth() &&
              new Date().getFullYear() === currentDate.getFullYear()
            
            const isSelected = 
              selectedDate?.getDate() === day &&
              selectedDate?.getMonth() === currentDate.getMonth() &&
              selectedDate?.getFullYear() === currentDate.getFullYear()
            
            const hasEventsForDay = hasEvents(day)
            
            return (
              <div
                key={`day-${day}`}
                className={`aspect-square p-1 ${
                  isSelected ? 'bg-blue-100 rounded-md' : ''
                }`}
                onClick={() => handleDateClick(day)}
              >
                <div
                  className={`flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md hover:bg-muted ${
                    isToday ? 'bg-blue-50 font-bold text-blue-600' : ''
                  }`}
                >
                  <span>{day}</span>
                  {hasEventsForDay && (
                    <div className="mt-1 h-1 w-1 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {selectedDate && (
          <div className="mt-6">
            <h3 className="font-medium">
              {formatDate(selectedDate)}
            </h3>
            <div className="mt-2 space-y-2">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-2 rounded-md border p-2"
                  >
                    <div
                      className={`mt-0.5 h-3 w-3 rounded-full ${getEventTypeColor(
                        event.type
                      )}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{event.title}</p>
                        {event.time && (
                          <p className="text-xs text-muted-foreground">
                            {event.time}
                          </p>
                        )}
                      </div>
                      {event.description && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs capitalize text-muted-foreground">
                        {event.type}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-20 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    No events for this date
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
