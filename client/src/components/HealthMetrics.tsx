
import { Card, CardContent } from "./ui/card"

export function HealthMetrics() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium">Daily Steps</h3>
            <p className="text-2xl font-bold">8,432</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium">Sleep Hours</h3>
            <p className="text-2xl font-bold">7.5</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
