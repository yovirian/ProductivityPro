import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { HealthMetrics } from "./HealthMetrics"
import { DeviceList } from "./DeviceList"

export function Dashboard() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Health Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600">
            <CardTitle className="text-white">Connected Devices</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <DeviceList />
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600">
            <CardTitle className="text-white">Health Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <HealthMetrics />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}