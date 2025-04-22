import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import Link from 'next/link'
import { BarChart, HelpCircle, Home, Settings, Users, Vote, Activity, PieChart, List } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const votingData = [
    { name: 'Day 1', votes: 4000 },
    { name: 'Day 2', votes: 3000 },
    { name: 'Day 3', votes: 2000 },
    { name: 'Day 4', votes: 2780 },
    { name: 'Day 5', votes: 1890 },
    { name: 'Day 6', votes: 2390 },
    { name: 'Day 7', votes: 3490 },
  ]
  
  const recentActivity = [
    { action: 'New user registered', time: '5 minutes ago' },
    { action: 'Ballot submitted', time: '10 minutes ago' },
    { action: 'Election settings updated', time: '1 hour ago' },
    { action: 'New candidate added', time: '2 hours ago' },
  ]

export default function OverViewPage() {
  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10,482</div>
                {/* <p className="text-xs text-muted-foreground">+2.5% from last election</p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
                <Vote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,741</div>
                {/* <p className="text-xs text-muted-foreground">83.4% turnout</p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Election Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
                {/* <p className="text-xs text-muted-foreground">2 ending this week</p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Smart Contract Status</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Running</div>
                {/* <p className="text-xs text-muted-foreground">All systems operational</p> */}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Recent Activity */}
          {/* <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button className="w-full">Start New Election</Button>
                <Button className="w-full">Manage Users</Button>
                <Button className="w-full">View Reports</Button>
                <Button className="w-full">System Settings</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-center">
                      <List className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </main>
    </PageContainer>
  );
}
