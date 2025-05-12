'use client'

import { useEffect, useState } from 'react'
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
import { getTotalVotesCast } from '@/utils/getContract';

export default function OverViewPage() {
  const [voterCount, setVoterCount] = useState<number | null>(null)
  const [votesCast, setVotesCast] = useState<number | null>(null)

  // Fetching data voters
  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const res = await fetch('/api/dashboard/voters')
        const data = await res.json()
        setVoterCount(data.count)
      } catch (error) {
        console.error('Failed to fetch voters:', error)
      }
    }

    fetchVoters()
  }, [])

  // Fetching total data vote cast
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/voters')
        const data = await res.json()
        setVoterCount(data.count)
  
        const votes = await getTotalVotesCast()
        setVotesCast(votes)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
  
    fetchData()
  }, [])
  
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
                <div className="text-2xl font-bold">{voterCount !== null ? voterCount : 'Loading...'}</div>
                {/* <p className="text-xs text-muted-foreground">+2.5% from last election</p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
                <Vote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {votesCast !== null ? votesCast.toLocaleString() : 'Loading...'}
                </div>
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
            {/* <Card>
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
          </Card> */}
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
