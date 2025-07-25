'use client'

import { useEffect, useState } from 'react'
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
import { BarChart, HelpCircle, Home, Settings, Users, Vote, Activity, PieChart, List, Copy, UserRoundX, ArrowUpRight } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Progress } from '@/components/ui/progress';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { getTotalVotesCast } from '@/utils/getContract';
import { toast } from "@/components/ui/use-toast"
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OverViewPage() {
  const [voterCount, setVoterCount] = useState<number | null>(null)
  const [votesCast, setVotesCast] = useState<number | null>(null)
  const [unverifiedCount, setUnverifiedCount] = useState<number | null>(null)
  const [participationRate, setParticipationRate] = useState<number | null>(null)
  const [electionStatus, setElectionStatus] = useState<"Active" | "Inactive" | null>(null);
  const [electionSchedule, setElectionSchedule] = useState<{ from: Date; to: Date } | null>(null);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";
  const [copied, setCopied] = useState(false);

  // Breadcrumbs data
  const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Admin', link: 'admin' },
  ];

  // handle copy
  const handleCopy = () => {
    if (!contractAddress) return;
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);

    toast({
      title: "Copied",
      description: "Smart contract address copied to clipboard",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const shortenAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "N/A";

  // Calculate voter participation rate
  const calculateParticipationRate = (votes: number, voters: number) => {
    if (voters === 0) return 0;
    return Math.round((votes / voters) * 100);
  };

  // Update participation rate when votesCast or voterCount changes
  useEffect(() => {
    if (votesCast !== null && voterCount !== null) {
      const rate = calculateParticipationRate(votesCast, voterCount);
      setParticipationRate(rate);
    }
  }, [votesCast, voterCount]);


  // Fetching data voters
  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const res = await fetch('/api/dashboard/voters')
        const data = await res.json()
        setVoterCount(data.count)
      } catch (error) {
        console.error('Failed to fetch voters:', error)
      }
    }

    fetchVoters()
  }, [])

  // Fetching total data vote cast
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/voters')
        const data = await res.json()
        setVoterCount(data.count)
  
        const votes = await getTotalVotesCast()
        setVotesCast(votes)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
  
    fetchData()
  }, [])

  // Fetching schedule
  useEffect(() => {
    const fetchElectionSchedule = async () => {
      try {
        const docSnap = await getDoc(doc(db, "election", "settings"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const from = new Date(data.schedule.from);
          const to = new Date(data.schedule.to);
          const now = new Date();

          setElectionSchedule({ from, to });

          if (now >= from && now <= to) {
            setElectionStatus("Active");
          } else {
            setElectionStatus("Inactive");
          }
        }
      } catch (err) {
        console.error("Failed to fetch election settings", err);
      }
    };

    fetchElectionSchedule();
  }, []);

  // Fetching unverified users count
  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      try {
        const res = await fetch('/api/dashboard/unverified-users')
        if (res.ok) {
          const data = await res.json()
          setUnverifiedCount(data.count)
        } else {
          console.error('Failed to fetch unverified users count')
        }
      } catch (error) {
        console.error('Failed to fetch unverified users:', error)
        setUnverifiedCount(0) // Set to 0 if there's an error
      }
    }

    fetchUnverifiedUsers()
  }, [])

  // Fetching voter not verified
  
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage the election, view statistics, and monitor voter participation.
          </p>
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Voters */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{voterCount !== null ? voterCount : 'Loading...'}</div>
                {/* <p className="text-xs text-muted-foreground">+2.5% from last election</p> */}
              </CardContent>
            </Card>

            {/* Votes Cast */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
                <Vote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {votesCast !== null ? votesCast.toLocaleString() : 'Loading...'}
                </div>
                {/* <p className="text-xs text-muted-foreground">83.4% turnout</p> */}
              </CardContent>
            </Card>

            {/* Election Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Election Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {electionStatus ?? "Loading..."}
                </div>
                {electionSchedule ? (
                  <p className="text-xs text-muted-foreground">
                    {electionSchedule.from.toLocaleDateString(
                      "en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })} - {electionSchedule.to.toLocaleDateString(
                      "en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">...</p>
                )}
              </CardContent>
            </Card>

            {/* Status Smart Contract */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Smart Contract Status</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Running</div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {shortenAddress(contractAddress)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-4 w-4 text-muted-foreground hover:text-primary"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Voter not Verified */}
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voter not Verified</CardTitle>
              <UserRoundX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unverifiedCount !== null ? unverifiedCount : 'Loading...'}</div>
              <p className="text-xs text-muted-foreground">
                {unverifiedCount === null
                  ? '...'
                  : unverifiedCount > 0
                  ? 'Require admin verification'
                  : 'All users verified'}
              </p>
            </CardContent>
          </Card>

          {/* Voter Participation */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voter Participation</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {participationRate !== null ? `${participationRate}%` : 'Loading...'}
              </div>
              {votesCast !== null && voterCount !== null ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    {/* <span>{votesCast.toLocaleString()} / {voterCount.toLocaleString()} votes</span>
                    <span>{participationRate}%</span> */}
                  </div>
                  <Progress value={participationRate || 0} className="h-2" />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Calculating...</p>
              )}
            </CardContent>
          </Card>
          </div>
      </div>
    </PageContainer>
  );
}
