"use client"
import { useEffect, useState } from "react"
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import Link from 'next/link'
import { BarChart, Calendar, HelpCircle, Info, Users } from 'lucide-react'
import ElectionCountdown from '../election-countdown'
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function OverViewPage() {
  // election date countdown
  const [electionEndDate, setElectionEndDate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchElection = async () => {
      const docSnap = await getDoc(doc(db, "election", "settings"))
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data?.schedule?.to) {
          setElectionEndDate(new Date(data.schedule.to))
        }
      }
    }

    fetchElection()
  }, [])

  // Set the election date (example: 30 days from now)
  // const electionDate = new Date()
  // electionDate.setDate(electionDate.getDate() + 30)

  // Set number admin for customer service
  const adminNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP;
  const message = encodeURIComponent(`Hi Admin, I need help regarding the voting process.`);
  const whatsappLink = `https://wa.me/${adminNumber}?text=${message}`;

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Welcome to the 2025 General Election for HIMATIF</CardTitle>
              <CardDescription className="text-center text-lg">Your vote shapes our future. Make it count!</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2" />
                  Election Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>The Election for the Himatif Chairperson marks an important moment for our student association. This year, we are implementing a secure and decentralized e-voting system to enhance accessibility, transparency, and efficiency in the voting process.</p>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>Voter Registration Deadline: July 1, 2024</li>
                  <li>Early Voting Begins: October 15, 2024</li>
                  <li>Election Day: November 5, 2024</li>
                </ul>
              </CardContent>
            </Card> */}
            <ElectionCountdown 
                  targetDate={electionEndDate}
                  title="Election Countdown"
                  description="The Election is currently open! Make sure to read this guide before voting."
                  linkText="View Voter Guide"
                  linkUrl="/dashboard/voter-guide"
                />
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How to Vote</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>Ensure you re registered to vote</li>
                <li>Review the list of candidates and their platforms</li>
                <li>On voting day, log in to the e-voting system</li>
                <li>Cast your vote securely</li>
                <li>Receive a confirmation of your vote</li>
              </ol>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/dashboard/vote">
                  Go to Voting Page
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="grid gap-6 md:grid-cols-3 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" />
                  Candidates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Learn about the candidates running in this election and their platforms.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/candidates">View Candidates</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2" />
                  Live Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Check the latest election results as they come in (available after polls close).</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/results">View Results</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get assistance with registration, voting process, or technical issues.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Help
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
