'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import PageContainer from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { getVotesForCandidate } from "@/utils/getContract";
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumbs } from '@/components/breadcrumbs';

type Candidate = {
  id: number;
  name: string;
  party: string;
  image: string;
  bio: string;
  votes: number;
}

export default function ElectionResultsPage() {

  const [isLoading, setIsLoading] = useState(true)
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Breadcrumb items
  const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Election Results', link: '/admin/results' },
  ];

  // Fetch candidates from API
    useEffect(() => {
      fetchCandidates();
    }, []);
  
  const fetchCandidates = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/candidates")
        const data = await res.json()

        const candidatesWithVotes = await Promise.all(
          data.map(async (candidate: Candidate) => {
            try {
              const votes = await getVotesForCandidate(candidate.id)
              return { ...candidate, votes }
            } catch (error) {
              console.error(`Error fetching votes for candidate ${candidate.id}`, error)
              return { ...candidate, votes: 0 }
            }
          })
        )

        setCandidates(candidatesWithVotes)
      } catch (error) {
        console.error("Error fetching candidates", error)
      } finally {
        setIsLoading(false)
      }
    };

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0)

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Election Results</h1>
            <p className="text-sm text-muted-foreground">
              View the results of the current election.
            </p>
          </div>
        </div>
        <Card>
            <CardHeader>
              {/* <CardTitle>Results Summary</CardTitle> */}
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
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="w-[50px] h-[50px] rounded-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-24 h-4" />
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Skeleton className="w-20 h-4" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-12 h-4" />
                          </TableCell>
                          <TableCell className="hidden md:table-cell w-1/4">
                            <div className="flex flex-col gap-1">
                              <Skeleton className="h-3 w-full mb-1" />
                              <Skeleton className="h-3 w-10" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    : candidates.map((candidate) => {
                        const percentage =
                          totalVotes > 0
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
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            </TableCell>
                            <TableCell>{candidate.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{candidate.party}</TableCell>
                            <TableCell>{candidate.votes.toLocaleString()}</TableCell>
                            <TableCell className="hidden md:table-cell w-1/4">
                              <div className="flex flex-col gap-1">
                                <Progress value={parseFloat(percentage)} />
                                <span className="text-sm text-muted-foreground">
                                  {percentage}%
                                </span>
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
    </PageContainer>
  )
}
