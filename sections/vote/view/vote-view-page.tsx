'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, BarChart, Home, Users, HelpCircle, Settings, CheckCircle, Copy, Download, Share2 } from 'lucide-react'
import Link from 'next/link'    
import Image from 'next/image'
import { vote } from "@/lib/actions/vote";
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import confetti from 'canvas-confetti'


type Candidate = {
  id: number
  name: string
  party: string
  votes: number
  image: string
  bio: string
}

export default function VoteVIewPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [timestamp, setTimestamp] = useState('')
  
  useEffect(() => {
    // Generate a random confirmation code
    const generateCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let result = ''
      for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 4 === 0) result += '-'
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }
  
    // Set the confirmation code and timestamp
    setConfirmationCode(generateCode())
    setTimestamp(new Date().toLocaleString())
  }, [])
  
  
  const copyConfirmationCode = () => {
    navigator.clipboard.writeText(confirmationCode)
    toast({
      title: "Copied to clipboard",
      description: "Your confirmation code has been copied to your clipboard.",
    })
  }
  
  const downloadReceipt = () => {
    // In a real application, this would generate a PDF receipt
    toast({
      title: "Receipt Downloaded",
      description: "Your voting receipt has been downloaded.",
    })
  }

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

  const confirmVote = async () => {
    if (selectedCandidate) {
      try {
        await vote(selectedCandidate.id); // vote di blockchain
        setCandidates(candidates.map(c => 
          c.id === selectedCandidate.id ? { ...c, votes: c.votes + 1 } : c
        ));
        setHasVoted(true);
      } catch (error: any) {
        console.error("Voting failed:", error);
        const message =
        error?.reason ||
        error?.error?.message ||
        error?.data?.message ||
        "Voting failed. Please try again.";
        toast({
          title: "Voting failed",
          description: message,
          variant: "destructive",
        });
      } finally {
        setShowConfirmation(false);
      }
    }
  };

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
        {!hasVoted && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">2024 National Election</CardTitle>
              <CardDescription className="text-center">Cast your vote for the next leader</CardDescription>
            </CardHeader>
          </Card>
        )}

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
          // <Card>
          //   <CardHeader>
          //     <CardTitle className="flex items-center">
          //       <BarChart className="mr-2" />
          //       Results
          //     </CardTitle>
          //     <CardDescription>Current vote distribution</CardDescription>
          //   </CardHeader>
          //   <CardContent>
          //     {candidates.map((candidate) => (
          //       <div key={candidate.id} className="mb-4 last:mb-0">
          //         <div className="flex items-center mb-2">
          //           <Image
          //             src={candidate.image}
          //             alt={candidate.name}
          //             width={40}
          //             height={40}
          //             className="rounded-full mr-2"
          //           />
          //           <div>
          //             <div className="text-sm font-medium">{candidate.name}</div>
          //             <div className="text-xs text-muted-foreground">{candidate.party}</div>
          //           </div>
          //         </div>
          //         <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          //           <div
          //             className="h-full bg-primary"
          //             style={{
          //               width: `${(candidate.votes / candidates.reduce((sum, c) => sum + c.votes, 0)) * 100}%`,
          //             }}
          //           />
          //         </div>
          //         <div className="mt-1 text-xs text-muted-foreground">{candidate.votes} votes</div>
          //       </div>
          //     ))}
          //   </CardContent>
          // </Card>
          
      // <main className="flex-1 p-8 overflow-auto flex items-center justify-center">
      //   <div className="max-w-md w-full">
      //     <Card className="border-green-200 shadow-lg">
      //       <CardHeader className="text-center bg-green-50 rounded-t-lg border-b border-green-100">
      //         <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full inline-flex">
      //           <CheckCircle className="h-12 w-12 text-green-600" />
      //         </div>
      //         <CardTitle className="text-2xl font-bold text-green-700">Vote Successfully Cast!</CardTitle>
      //         <CardDescription>Your vote has been securely recorded</CardDescription>
      //       </CardHeader>
      //       <CardContent className="pt-6 space-y-6">
      //         <Alert className="bg-green-50 border-green-200">
      //           <CheckCircle className="h-4 w-4 text-green-600" />
      //           <AlertTitle>Thank you for participating</AlertTitle>
      //           <AlertDescription>
      //             Your vote has been anonymously and securely recorded in our system.
      //           </AlertDescription>
      //         </Alert>
              
      //         <div className="space-y-4">
      //           <div>
      //             <h3 className="text-sm font-medium text-gray-500">Confirmation Code</h3>
      //             <div className="mt-1 flex items-center">
      //               <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono flex-1">
      //                 {confirmationCode}
      //               </code>
      //               <Button 
      //                 variant="ghost" 
      //                 size="icon" 
      //                 onClick={copyConfirmationCode}
      //                 className="ml-2"
      //               >
      //                 <Copy className="h-4 w-4" />
      //                 <span className="sr-only">Copy confirmation code</span>
      //               </Button>
      //             </div>
      //           </div>
                
      //           <div>
      //             <h3 className="text-sm font-medium text-gray-500">Timestamp</h3>
      //             <p className="mt-1 text-sm">{timestamp}</p>
      //           </div>
                
      //           <div>
      //             <h3 className="text-sm font-medium text-gray-500">Election</h3>
      //             <p className="mt-1 text-sm">2024 National Election</p>
      //           </div>
      //         </div>
      //       </CardContent>
      //       <CardFooter className="flex flex-col space-y-3">
      //         <div className="grid grid-cols-2 gap-3 w-full">
      //           <Button 
      //             variant="outline" 
      //             className="w-full" 
      //             onClick={downloadReceipt}
      //           >
      //             <Download className="h-4 w-4 mr-2" />
      //             Download Receipt
      //           </Button>
      //           <Button 
      //             variant="outline" 
      //             className="w-full"
      //             onClick={() => {
      //               toast({
      //                 title: "Share Link Generated",
      //                 description: "A link to verify your participation has been copied to clipboard.",
      //               })
      //             }}
      //           >
      //             <Share2 className="h-4 w-4 mr-2" />
      //             Share Participation
      //           </Button>
      //         </div>
      //         <Button asChild className="w-full">
      //           <Link href="/">Return to Home</Link>
      //         </Button>
      //       </CardFooter>
      //     </Card>
          
      //     <div className="mt-6 text-center text-sm text-gray-500">
      //       <p>
      //         Having issues? <Link href="/help" className="text-green-600 hover:underline">Contact support</Link>
      //       </p>
      //     </div>
      //   </div>
      // </main>
      <div className="max-w-md mx-auto">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="text-center bg-green-50 rounded-t-lg border-b border-green-100">
                <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full inline-flex">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-700">Vote Successfully Cast!</CardTitle>
                <CardDescription>Your vote has been securely recorded</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Thank you for participating</AlertTitle>
                  <AlertDescription>
                    Your vote has been anonymously and securely recorded in our system.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Confirmation Code</h3>
                    <div className="mt-1 flex items-center">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono flex-1">
                        {confirmationCode}
                      </code>
                      <Button variant="ghost" size="icon" onClick={copyConfirmationCode} className="ml-2">
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy confirmation code</span>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Timestamp</h3>
                    <p className="mt-1 text-sm">{timestamp}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Election</h3>
                    <p className="mt-1 text-sm">2024 National Election</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button variant="outline" className="w-full" onClick={downloadReceipt}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => {
                    toast({
                      title: "Share Link Generated",
                      description: "A link to verify your participation has been copied to clipboard.",
                    });
                  }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Receipt
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
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