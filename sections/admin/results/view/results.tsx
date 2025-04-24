'use client'

import { useState } from "react"
import Image from "next/image"
import PageContainer from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

type Candidate = {
  id: number
  name: string
  party: string
  image: string
  votes: number
}

export default function ElectionResultsPage() {
  const [candidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Alice Johnson",
      party: "Progressive Party",
      image: "/placeholder.svg?height=400&width=300",
      votes: 1234
    },
    {
      id: 2,
      name: "Bob Smith",
      party: "Conservative Party",
      image: "/placeholder.svg?height=400&width=300",
      votes: 1111
    },
    {
      id: 3,
      name: "Clara Davis",
      party: "Green Party",
      image: "/placeholder.svg?height=400&width=300",
      votes: 789
    }
  ])

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0)

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Election Results</h1>

          <Card>
            <CardHeader>
              <CardTitle>Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => {
                    const percentage = totalVotes > 0
                      ? ((candidate.votes / totalVotes) * 100).toFixed(1)
                      : "0.0"
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
                        <TableCell>{candidate.party}</TableCell>
                        <TableCell>{candidate.votes.toLocaleString()}</TableCell>
                        <TableCell className="w-1/4">
                          <div className="flex flex-col gap-1">
                            <Progress value={parseFloat(percentage)} />
                            <span className="text-sm text-muted-foreground">{percentage}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageContainer>
  )
}
