import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-blue-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            <div
              className={
                trend.isPositive ? "text-green-600" : "text-destructive"
              }
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </div>
            <p className="text-muted-foreground">from last month</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
