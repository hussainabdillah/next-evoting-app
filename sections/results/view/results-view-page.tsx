'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import PageContainer from '@/components/layout/page-container'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, HelpCircle, Home, Settings, Users, Vote } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"


const results = [
  { name: "Alice Johnson", party: "Progressive Party", votes: 1234, color: "hsl(var(--chart-1))" },
  { name: "Bob Smith", party: "Conservative Party", votes: 1111, color: "hsl(var(--chart-2))" },
  { name: "Carol Williams", party: "Green Party", votes: 987, color: "hsl(var(--chart-3))" },
  { name: "David Brown", party: "Liberal Party", votes: 876, color: "hsl(var(--chart-4))" },
  { name: "Eve Davis", party: "Independent", votes: 543, color: "hsl(var(--chart-5))" },
]

const totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0)

export default function ResultsViewPage() {
  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Election Results</CardTitle>
              <CardDescription className="text-center">Current standings for the 2024 National Election</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Results Visualization</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    ...Object.fromEntries(results.map(r => [r.name, { label: r.name, color: r.color }]))
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={results}
                        dataKey="votes"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {results.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Results Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Candidate</th>
                        <th className="text-left p-2">Party</th>
                        <th className="text-right p-2">Votes</th>
                        <th className="text-right p-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{result.name}</td>
                          <td className="p-2">{result.party}</td>
                          <td className="text-right p-2">{result.votes.toLocaleString()}</td>
                          <td className="text-right p-2">
                            {((result.votes / totalVotes) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold">
                        <td className="p-2" colSpan={2}>Total</td>
                        <td className="text-right p-2">{totalVotes.toLocaleString()}</td>
                        <td className="text-right p-2">100%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Election Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This page shows the current results of the 2024 National Election. The results are updated in real-time as votes are counted. Please note that these results are not final until all votes have been tallied and the election has been officially certified.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/voting-info">Learn More About the Voting Process</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      </PageContainer>
  );
}