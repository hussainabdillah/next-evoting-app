
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function ElectionManagementPage() {
  const isElectionActive = true // ini nanti bisa pakai fetch dari DB atau context
  const totalVoters = 150
  const totalVotes = 87
  const participation = Math.round((totalVotes / totalVoters) * 100)

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Election Status</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <Label>{isElectionActive ? "Active" : "Inactive"}</Label>
          </div>
          <Switch checked={isElectionActive} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Election Schedule</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Start Time</Label>
            <input type="datetime-local" className="w-full border rounded p-2 mt-1" />
          </div>
          <div>
            <Label>End Time</Label>
            <input type="datetime-local" className="w-full border rounded p-2 mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participation Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm mb-2">
            <span>{totalVotes} / {totalVoters} votes</span>
            <span>{participation}%</span>
          </div>
          <Progress value={participation} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="outline">Reset Election</Button>
          <Button variant="outline">Notify Voters</Button>
          <Button>Export Results</Button>
        </CardContent>
      </Card>
    </div>
  )
}
