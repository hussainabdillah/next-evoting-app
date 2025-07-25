'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import PageContainer from '@/components/layout/page-container'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, HelpCircle, Home, Settings, Users, Vote, Info } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from '@/components/ui/skeleton'
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { PieGraph } from '../pie-graph'
import { getVotesForCandidate } from "@/utils/getContract";
import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

type Candidate = {
  id: number;
  name: string;
  party: string;
  image: string;
  bio: string;
  votes: number;
}

export default function ResultsViewPage() {
    // schedule
    const [status, setStatus] = useState<'before' | 'during' | 'after' | 'loading'>('loading');
    const [schedule, setSchedule] = useState<{ from: Date; to: Date } | null>(null)

    // fetch result from blockchain
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // const [hasVoted, setHasVoted] = useState(false);

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

      // fetch schedule
      useEffect(() => {
        const fetchSchedule = async () => {
          const docSnap = await getDoc(doc(db, "election", "settings"))
          if (docSnap.exists()) {
            const data = docSnap.data()
            if (data?.schedule?.from && data?.schedule?.to) {
              const from = new Date(data.schedule.from)
              const to = new Date(data.schedule.to)
              setSchedule({ from, to })
              setStatus(determineStatus(from, to))
            }
          }
        }

        fetchSchedule()
      }, [])
    
      // determine status
      const determineStatus = (from: Date, to: Date) => {
        const now = new Date()
        if (now < from) return 'before'
        if (now > to) return 'after'
        return 'during'
      };

    return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">

          {/* Saat loading */}
          {status === 'loading' && (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Skeleton Header */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </CardHeader>
              </Card>
              {/* Skeleton Card Content*/}
              <Card>
                <CardHeader>
                  <Skeleton className="w-48 h-6 mb-2" /> {/* Title skeleton */}
                  <Skeleton className="w-96 h-6 mb-2" />
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Election belum dimulai */}
          {status === 'before' && schedule && (
            <div className="space-y-4">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">Election Results</CardTitle>
                  <CardDescription className="text-center">
                    Current standings for the 2025 General Election of Himatif
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-yellow-100 dark:bg-yellow-900">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-200 font-bold">
                  <Info className="mr-2" />
                  The Election has not started yet!
                </CardTitle>
                <CardDescription className="dark:text-yellow-100">
                  Election will go live on{" "}
                  <span className="font-semibold">
                    {schedule.from.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Jakarta",
                    })}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
            </div>
          )}

          {/* Jika sedang berlangsung atau sudah selesai */}
          {(status === 'during' || status === 'after') && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">Election Results</CardTitle>
                  <CardDescription className="text-center">
                    Current standings for the 2025 General Election of Himatif
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Hanya tampil jika masih berlangsung */}
              {status === 'during' && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Election Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      This page shows the current results of the 2025 General Election of Himatif. The results are
                      updated in real-time as votes are counted. Please note that these results are not final until all
                      votes have been tallied and the election has been officially certified.
                    </p>
                  </CardContent>
                </Card>
              )}

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
                      ) : candidates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            There is no results recorded yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        candidates.map((candidate) => {
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
                                  className="w-12 h-12 rounded-full object-cover"
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
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </PageContainer>
  );
}