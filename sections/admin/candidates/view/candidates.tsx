'use client'

import { useState } from 'react'
import Image from 'next/image'
import PageContainer from '@/components/layout/page-container'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

type Candidate = {
  id: number
  name: string
  party: string
  image: string
  description: string
  votes: number
}

export default function CandidatesManagementPage() {
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Alice Johnson",
      party: "Progressive Party",
      image: "/placeholder.svg?height=400&width=300",
      description: "Alice Johnson is a seasoned politician with 15 years of experience.",
      votes: 1234
    },
    {
      id: 2,
      name: "Bob Smith",
      party: "Conservative Party",
      image: "/placeholder.svg?height=400&width=300",
      description: "Bob Smith is a successful businessman turned politician.",
      votes: 1111
    }
  ])

  const handleSaveCandidate = () => {
    if (editingCandidate) {
      setCandidates(prev =>
        prev.map(c => c.id === editingCandidate.id ? editingCandidate : c)
      )
      toast({
        title: "Candidate Updated",
        description: `${editingCandidate.name}'s information has been updated.`,
      })
      setEditingCandidate(null)
    }
  }

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Manage Candidates</h1>

          <Card>
            <CardHeader>
              <CardTitle>Candidate List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
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
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setEditingCandidate(candidate)}>
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Candidate</DialogTitle>
                              <DialogDescription>
                                Update candidate information below
                              </DialogDescription>
                            </DialogHeader>
                            {editingCandidate && (
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="candidate-name">Name</Label>
                                  <Input
                                    id="candidate-name"
                                    value={editingCandidate.name}
                                    onChange={(e) => setEditingCandidate({
                                      ...editingCandidate,
                                      name: e.target.value
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="candidate-party">Party</Label>
                                  <Input
                                    id="candidate-party"
                                    value={editingCandidate.party}
                                    onChange={(e) => setEditingCandidate({
                                      ...editingCandidate,
                                      party: e.target.value
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="candidate-image">Image URL</Label>
                                  <Input
                                    id="candidate-image"
                                    value={editingCandidate.image}
                                    onChange={(e) => setEditingCandidate({
                                      ...editingCandidate,
                                      image: e.target.value
                                    })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="candidate-description">Description</Label>
                                  <Textarea
                                    id="candidate-description"
                                    value={editingCandidate.description}
                                    onChange={(e) => setEditingCandidate({
                                      ...editingCandidate,
                                      description: e.target.value
                                    })}
                                    rows={4}
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button onClick={handleSaveCandidate}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageContainer>
  )
}
