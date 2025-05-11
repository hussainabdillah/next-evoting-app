'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import PageContainer from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { getVotesForCandidate } from "@/utils/getContract";

type Candidate = {
  id: number;
  name: string;
  party: string;
  image: string;
  bio: string;
  votes: number;
}

export default function ElectionResultsPage() {

  
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Fetch candidates from API
    useEffect(() => {
      fetchCandidates();
    }, []);
  
    const fetchCandidates = async () => {
      const res = await fetch('/api/candidates');
      const data = await res.json();

      // Ambil jumlah suara dari smart contract untuk setiap kandidat
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
    };

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0)

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
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
