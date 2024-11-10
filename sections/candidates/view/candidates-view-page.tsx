'use client'
import PageContainer from '@/components/layout/page-container';
import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Candidate = {
    id: number
    name: string
    party: string
    image: string
    bio: string
    policies: string[]
  }

  const candidates: Candidate[] = [
    {
      id: 1,
      name: "Alice Johnson",
      party: "Progressive Party",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Alice Johnson is a seasoned politician with 15 years of experience in public service. She is committed to environmental protection and social justice.",
      policies: ["Green energy transition", "Universal healthcare", "Education reform"]
    },
    {
      id: 2,
      name: "Bob Smith",
      party: "Conservative Party",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Bob Smith is a successful businessman turned politician. He focuses on economic growth and traditional values.",
      policies: ["Tax cuts for businesses", "Stricter immigration policies", "Increased defense spending"]
    },
    {
      id: 3,
      name: "Carol Williams",
      party: "Green Party",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Carol Williams is an environmental scientist and activist. She advocates for urgent action on climate change and sustainable development.",
      policies: ["Carbon tax", "Renewable energy investment", "Wildlife conservation"]
    },
    {
      id: 4,
      name: "David Brown",
      party: "Liberal Party",
      image: "/placeholder.svg?height=400&width=300",
      bio: "David Brown is a human rights lawyer with a focus on civil liberties. He campaigns for equality and justice for all.",
      policies: ["Criminal justice reform", "LGBTQ+ rights", "Affordable housing"]
    },
    {
      id: 5,
      name: "Eve Davis",
      party: "Independent",
      image: "/placeholder.svg?height=400&width=300",
      bio: "Eve Davis is a community organizer and grassroots activist. She aims to bring fresh perspectives to politics and fight corruption.",
      policies: ["Campaign finance reform", "Participatory budgeting", "Term limits for politicians"]
    },
  ]



export default function CandidatesViewPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Candidates</CardTitle>
              <CardDescription className="text-center">Learn about the candidates running in the 2024 National Election</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <CardContent>
                  <p className="line-clamp-3">{candidate.bio}</p>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setSelectedCandidate(candidate)}>
                        Learn More
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{selectedCandidate?.name}</DialogTitle>
                        <DialogDescription>{selectedCandidate?.party}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Image
                          src={selectedCandidate?.image || ''}
                          alt={selectedCandidate?.name || ''}
                          width={300}
                          height={400}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <p>{selectedCandidate?.bio}</p>
                        <div>
                          <h4 className="font-semibold mb-2">Key Policies:</h4>
                          <ul className="list-disc list-inside">
                            {selectedCandidate?.policies.map((policy, index) => (
                              <li key={index}>{policy}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </PageContainer>
  );
}