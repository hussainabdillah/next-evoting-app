'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, BarChart, Home, Users, HelpCircle, Settings } from 'lucide-react'
import Link from 'next/link'    
import Image from 'next/image'

type Candidate = {
  id: number
  name: string
  party: string
  votes: number
  image: string
  bio: string
}

export default function VoteVIewPage() {
  // const [candidates, setCandidates] = useState<Candidate[]>([
  //   { id: 1, name: "Alice Johnson", party: "Progressive Party", votes: 0, image: "/placeholder.svg?height=400&width=300" },
  //   { id: 2, name: "Bob Smith", party: "Conservative Party", votes: 0, image: "/placeholder.svg?height=400&width=300" },
  //   { id: 3, name: "Carol Williams", party: "Green Party", votes: 0, image: "/placeholder.svg?height=400&width=300" },
  //   // { id: 4, name: "David Brown", party: "Liberal Party", votes: 0, image: "/placeholder.svg?height=400&width=300" },
  //   // { id: 5, name: "Eve Davis", party: "Independent", votes: 0, image: "/placeholder.svg?height=400&width=300" },
  // ])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  // handl fetch data candidates
    useEffect(() => {
      const fetchCandidates = async () => {
        try {
          const res = await fetch('/api/candidates');
          if (!res.ok) {
            console.error('Failed to fetch candidates:', res.statusText);
            return;
          }
  
          const data = await res.json();
          console.log('Data fetched:', data);
          setCandidates(data);
        } catch (error) {
          console.error('Error fetching candidates:', error);
        }
      };
      fetchCandidates()
    }, [])

  const handleVote = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setShowConfirmation(true)
  }

  const confirmVote = () => {
    if (selectedCandidate) {
      setCandidates(candidates.map(c => 
        c.id === selectedCandidate.id ? { ...c, votes: c.votes + 1 } : c
      ))
      setHasVoted(true)
      setShowConfirmation(false)
    }
  }

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">2024 National Election</CardTitle>
            <CardDescription className="text-center">Cast your vote for the next leader</CardDescription>
          </CardHeader>
        </Card>

        {!hasVoted ? (
          <Card>
            <CardHeader>
              <CardTitle>Candidates</CardTitle>
              <CardDescription>Select a candidate to cast your vote</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <ScrollArea className="h-[600px] pr-4"> */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {candidates.map((candidate) => (
                    <Card key={candidate.id} className="overflow-hidden">
                      <Image
                        src={candidate.image}
                        alt={candidate.name}
                        width={300}
                        height={400}
                        className="w-full h-48 object-cover"
                      />
                      <CardHeader>
                        <CardTitle>{candidate.name}</CardTitle>
                        <CardDescription>{candidate.party}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handleVote(candidate)}>
                          Vote <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              {/* </ScrollArea> */}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2" />
                Results
              </CardTitle>
              <CardDescription>Current vote distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {candidates.map((candidate) => (
                <div key={candidate.id} className="mb-4 last:mb-0">
                  <div className="flex items-center mb-2">
                    <Image
                      src={candidate.image}
                      alt={candidate.name}
                      width={40}
                      height={40}
                      className="rounded-full mr-2"
                    />
                    <div>
                      <div className="text-sm font-medium">{candidate.name}</div>
                      <div className="text-xs text-muted-foreground">{candidate.party}</div>
                    </div>
                  </div>
                  <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(candidate.votes / candidates.reduce((sum, c) => sum + c.votes, 0)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{candidate.votes} votes</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Your Vote</DialogTitle>
              <DialogDescription>
                Are you sure you want to vote for {selectedCandidate?.name}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
              <Button onClick={confirmVote}>Confirm Vote</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </main>
    </PageContainer>
  );
}