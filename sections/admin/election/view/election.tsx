'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PageContainer from '@/components/layout/page-container';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Calendar, Clock, HelpCircle, Home, Settings, Users, Vote } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type Candidate = {
  id: number
  name: string
  party: string
  image: string
  description: string
  votes: number
}

export default function ElectionManagementPage() {
  const [electionActive, setElectionActive] = useState(false)
  const [startDate, setStartDate] = useState('2024-05-01')
  const [startTime, setStartTime] = useState('08:00')
  const [endDate, setEndDate] = useState('2024-05-03')
  const [endTime, setEndTime] = useState('20:00')
  const [isScheduled, setIsScheduled] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Alice Johnson",
      party: "Progressive Party",
      image: "/placeholder.svg?height=400&width=300",
      description: "Alice Johnson is a seasoned politician with 15 years of experience in public service. She is committed to environmental protection and social justice.",
      votes: 1234
    },
    {
      id: 2,
      name: "Bob Smith",
      party: "Conservative Party",
      image: "/placeholder.svg?height=400&width=300",
      description: "Bob Smith is a successful businessman turned politician. He focuses on economic growth and traditional values.",
      votes: 1111
    },
    {
      id: 3,
      name: "Carol Williams",
      party: "Green Party",
      image: "/placeholder.svg?height=400&width=300",
      description: "Carol Williams is an environmental scientist and activist. She advocates for urgent action on climate change and sustainable development.",
      votes: 987
    },
    {
      id: 4,
      name: "David Brown",
      party: "Liberal Party",
      image: "/placeholder.svg?height=400&width=300",
      description: "David Brown is a human rights lawyer with a focus on civil liberties. He campaigns for equality and justice for all.",
      votes: 876
    },
    {
      id: 5,
      name: "Eve Davis",
      party: "Independent",
      image: "/placeholder.svg?height=400&width=300",
      description: "Eve Davis is a community organizer and grassroots activist. She aims to bring fresh perspectives to politics and fight corruption.",
      votes: 543
    },
  ])

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)

  const handleElectionToggle = () => {
    setElectionActive(!electionActive)
    toast({
      title: electionActive ? "Election Ended" : "Election Started",
      description: electionActive ? "The election has been closed." : "The election is now open for voting.",
    })
  }

  const handleScheduleElection = () => {
    setIsScheduled(true)
    toast({
      title: "Election Scheduled",
      description: `The election will start on ${startDate} at ${startTime} and end on ${endDate} at ${endTime}.`,
    })
  }

  const handleSaveCandidate = () => {
    if (editingCandidate) {
      setCandidates(candidates.map(candidate => 
        candidate.id === editingCandidate.id ? editingCandidate : candidate
      ))
      setEditingCandidate(null)
      toast({
        title: "Candidate Updated",
        description: `${editingCandidate.name}'s information has been updated.`,
      })
    }
  }

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Election Management</h1>
          
          <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="status">Election Status</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            {/* Election Status Tab */}
            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <CardTitle>Election Status</CardTitle>
                  <CardDescription>Manage the current election status and schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="text-lg font-medium">Current Status</h3>
                      <p className="text-muted-foreground">
                        {electionActive ? "Election is active" : "Election is not active"}
                      </p>
                    </div>
                    <Switch
                      checked={electionActive}
                      onCheckedChange={handleElectionToggle}
                    />
                  </div>
                  
                  {/* <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Schedule Election</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <Label htmlFor="start-date">Start Date</Label>
                        </div>
                        <Input
                          id="start-date"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <Label htmlFor="start-time">Start Time</Label>
                        </div>
                        <Input
                          id="start-time"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <Label htmlFor="end-date">End Date</Label>
                        </div>
                        <Input
                          id="end-date"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <Label htmlFor="end-time">End Time</Label>
                        </div>
                        <Input
                          id="end-time"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button className="mt-4" onClick={handleScheduleElection}>
                      Schedule Election
                    </Button>
                  </div> */}
                  
                  {isScheduled && (
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium">Scheduled Election</h3>
                      <p>Start: {startDate} at {startTime}</p>
                      <p>End: {endDate} at {endTime}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Candidates Tab */}
            <TabsContent value="candidates">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Candidates</CardTitle>
                  <CardDescription>Edit candidate information</CardDescription>
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
                              src={candidate.image || "/placeholder.svg"}
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
                                    Update the candidate's information
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
            </TabsContent>
            
            {/* Results Tab */}
            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle>Election Results</CardTitle>
                  <CardDescription>
                    {electionActive 
                      ? "Live results of the ongoing election" 
                      : "Final results of the completed election"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="h-[400px]">
                      <ChartContainer
                        config={{
                          ...Object.fromEntries(candidates.map(c => [c.name, { label: c.name, color: `hsl(${c.id * 60}, 70%, 50%)` }]))
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={candidates}
                              dataKey="votes"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label
                            >
                              {candidates.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(${entry.id * 60}, 70%, 50%)`} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    
                    <div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Party</TableHead>
                            <TableHead className="text-right">Votes</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {candidates
                            .sort((a, b) => b.votes - a.votes)
                            .map((candidate) => (
                              <TableRow key={candidate.id}>
                                <TableCell>{candidate.name}</TableCell>
                                <TableCell>{candidate.party}</TableCell>
                                <TableCell className="text-right">{candidate.votes.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                  {((candidate.votes / totalVotes) * 100).toFixed(2)}%
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                        <tfoot>
                          <tr className="border-t">
                            <td colSpan={2} className="py-2 font-medium">Total</td>
                            <td className="py-2 text-right font-medium">{totalVotes.toLocaleString()}</td>
                            <td className="py-2 text-right font-medium">100%</td>
                          </tr>
                        </tfoot>
                      </Table>
                      
                      {!electionActive && (
                        <Button className="mt-4 w-full">
                          Export Final Results
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </PageContainer>
  )
}