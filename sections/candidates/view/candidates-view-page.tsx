'use client'
import { useEffect, useState } from 'react'
import PageContainer from '@/components/layout/page-container'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Skeleton } from '@/components/ui/skeleton'

type Candidate = {
  id: number
  name: string
  party: string
  image: string
  bio: string
}

export default function CandidatesViewPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch('/api/candidates');
        if (!res.ok) {
          console.error('Failed to fetch candidates:', res.statusText);
          return;
        }

        const data = await res.json();
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Candidates</CardTitle>
              <CardDescription className="text-center">
                Learn about the candidates running in the 2025 General Election of Himatif
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardHeader>
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-4/6" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))
            ) : (
              candidates.map((candidate) => (
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
                  <CardContent>
                    <p className="line-clamp-3">{candidate.bio}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setIsDialogOpen(true);
                      }}
                    >
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Dialog tampil hanya saat kandidat dipilih */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedCandidate && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedCandidate.name}</DialogTitle>
              <DialogDescription>{selectedCandidate.party}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Image
                src={selectedCandidate.image}
                alt={selectedCandidate.name}
                width={300}
                height={400}
                className="w-full h-48 object-cover rounded-md"
              />
              <p>{selectedCandidate.bio}</p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </PageContainer>
  )
}
