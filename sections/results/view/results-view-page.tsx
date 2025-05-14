'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import PageContainer from '@/components/layout/page-container'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, HelpCircle, Home, Settings, Users, Vote } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from '@/components/ui/skeleton'
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { PieGraph } from '../pie-graph'
import { getVotesForCandidate } from "@/utils/getContract";

type Candidate = {
  id: number;
  name: string;
  party: string;
  image: string;
  bio: string;
  votes: number;
}

// const results = [
//   { name: "Alice Johnson", party: "Progressive Party", votes: 1234, color: "hsl(var(--chart-1))" },
//   { name: "Bob Smith", party: "Conservative Party", votes: 1111, color: "hsl(var(--chart-2))" },
//   { name: "Carol Williams", party: "Green Party", votes: 987, color: "hsl(var(--chart-3))" },
//   { name: "David Brown", party: "Liberal Party", votes: 876, color: "hsl(var(--chart-4))" },
//   { name: "Eve Davis", party: "Independent", votes: 543, color: "hsl(var(--chart-5))" },
// ]

// const totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0)

export default function ResultsViewPage() {

  // fetch result from blockchain
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch candidates from API
      useEffect(() => {
        fetchCandidates();
      }, []);
    
      const fetchCandidates = async () => {
        try {
          const res = await fetch('/api/candidates');
          const data = await res.json();

          const candidatesWithVotes = await Promise.all(
            data.map(async (candidate: Candidate) => {
              try {
                const votes = await getVotesForCandidate(candidate.id);
                return { ...candidate, votes };
              } catch (error) {
                console.error(`Error fetching votes for candidate ${candidate.id}`, error);
                return { ...candidate, votes: 0 };
              }
            })
          );

          setCandidates(candidatesWithVotes);
        } catch (err) {
          console.error('Failed to fetch candidates:', err);
        } finally {
          setIsLoading(false);
        }
      };
      
      const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0)

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Election Results</CardTitle>
              <CardDescription className="text-center">Current standings for the 2025 General Election of Himatif</CardDescription>
            </CardHeader>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Election Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This page shows the current results of the 2025 General Election of Himatif. The results are updated in real-time as votes are counted. Please note that these results are not final until all votes have been tallied and the election has been officially certified.</p>
            </CardContent>
            {/* <CardFooter>
              <Button asChild>
                <Link href="/voting-info">Learn More About the Voting Process</Link>
              </Button>
            </CardFooter> */}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Party</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead className="hidden md:table-cell">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="w-[50px] h-[50px] rounded-full" />
                        </TableCell>
                        <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="w-20 h-4" /></TableCell>
                        <TableCell><Skeleton className="w-12 h-4" /></TableCell>
                        <TableCell className="hidden md:table-cell w-1/4">
                          <Skeleton className="h-3 w-full mb-1" />
                          <Skeleton className="h-3 w-10" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    candidates.map((candidate) => {
                      const percentage = totalVotes > 0
                        ? ((candidate.votes / totalVotes) * 100).toFixed(1)
                        : "0.0";
                      return (
                        <TableRow key={candidate.id}>
                          <TableCell>
                            <Image
                              src={candidate.image}
                              alt={candidate.name}
                              width={50}
                              height={50}
                              className="rounded-full object-cover"
                            />
                          </TableCell>
                          <TableCell>{candidate.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{candidate.party}</TableCell>
                          <TableCell>{candidate.votes.toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell w-1/4">
                            <div className="flex flex-col gap-1">
                              <Progress value={parseFloat(percentage)} />
                              <span className="text-sm text-muted-foreground">{percentage}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* <div className="grid gap-8 md:grid-cols-2">
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

            <PieGraph />

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
          </div> */}
        </div>
      </main>
      </PageContainer>
  );
}