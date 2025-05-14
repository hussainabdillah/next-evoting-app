'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, BarChart, Home, Users, HelpCircle, Settings, CheckCircle, Copy, Download, Share2, View } from 'lucide-react'
import Link from 'next/link'    
import Image from 'next/image'
import { vote } from "@/lib/actions/vote";
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from '@/components/ui/skeleton';
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
  const [transactionId, setTransactionId] = useState<string>('')
  const [hasVoted, setHasVoted] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [timestamp, setTimestamp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCandidatesLoading, setIsCandidatesLoading] = useState(true)
  

  
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
          setCandidates(data);
        } catch (error) {
          console.error('Error fetching candidates:', error);
        } finally {
          setIsCandidatesLoading(false);
        }
      };

      fetchCandidates();
    }, []);

  const handleVote = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setShowConfirmation(true)
  }

  const confirmVote = async () => {
    if (selectedCandidate) {
      setShowConfirmation(false);
      setIsLoading(true)  
      try {
        const tx = await vote(selectedCandidate.id); // vote returns transaction, vote di blockchain
        setTransactionId(tx.hash); // save tx hash as transaction ID
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
        setIsLoading(false)
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
              <CardTitle className="text-2xl font-bold text-center">HIMATIF 2025 Election</CardTitle>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isCandidatesLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="w-full h-48" />
                      <CardHeader>
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-3 w-1/3" />
                      </CardHeader>
                      <CardFooter>
                        <Skeleton className="h-10 w-full rounded-md" />
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
                      <CardFooter>
                        <Button className="w-full" onClick={() => handleVote(candidate)}>
                          Vote <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ) : (      
      // receipt succes voting
      <div className="max-w-md mx-auto">
        <Card className="border-green-200 dark:border-green-800 shadow-lg">
          <CardHeader className="text-center bg-green-50 dark:bg-green-900 rounded-t-lg border-b border-green-100 dark:border-green-800">
            <div className="mx-auto mb-4 bg-green-100 dark:bg-green-800 p-3 rounded-full inline-flex">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-300">
              Vote Successfully Cast!
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              Your vote has been securely recorded
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <Alert className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="dark:text-green-300">Thank you for participating</AlertTitle>
              <AlertDescription className="dark:text-green-400">
                Your vote has been anonymously and securely recorded in our system.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Transaction ID</h3>
                <div className="mt-1 flex items-center">
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono flex-1 text-gray-800 dark:text-gray-100">
                  {transactionId.slice(0, 6)}...{transactionId.slice(-4)}
                  </code>
                  <Button variant="ghost" size="icon" onClick={() => {
                          navigator.clipboard.writeText(transactionId)
                          toast({ title: "Copied", description: "Transaction ID copied." })
                        }} 
                      className="ml-2">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy Transaction ID</span>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Timestamp</h3>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{timestamp}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Election</h3>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">2025 General Election Himatif</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <div className="grid grid-cols-2 gap-3 w-full">
            <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(`https://sepolia.etherscan.io/tx/${transactionId}`, '_blank')}
              >
                <View className="h-4 w-4 mr-2" />
                View Detail
            </Button>
            <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const url = `https://sepolia.etherscan.io/tx/${transactionId}`
                  navigator.clipboard.writeText(url)
                  toast({
                    title: "Share Link Generated",
                    description: "A link to verify your participation has been copied to clipboard.",
                  })
                }}
              >
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
        
        {/* loading state */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-white"></div>
              <p className="text-white text-lg">Waiting for transaction confirmation...</p>
            </div>
          </div>
        )}
      </main>
    </PageContainer>
  );
}