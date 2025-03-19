
import { Card, CardContent } from "./ui/card"

export function DeviceList() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-xl font-semibold">Smart Watch</h3>
            <p className="text-sm text-green-500">Connected</p>
            <p className="text-sm text-gray-500">Last sync: 2 mins ago</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">85%</div>
            <p className="text-sm text-gray-500">Battery</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
