'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Calendar,
  Crown,
  HelpCircle,
  Home,
  Settings,
  Trophy,
  Users,
  Vote
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import { ethers } from "ethers";
import contractJson from "../../../contracts/Voting.json";
import { vote } from '@/lib/actions/vote';

type Candidate = {
  id: number;
  name: string;
  party: string;
  image: string;
  bio: string;
  votes: number;
};

type ElectionResult = {
  year: number;
  title: string;
  contractAddress: string;
  candidates: Candidate[];
  winner: Candidate | null;
  totalVotes: number;
  turnout: number;
  isLoading: boolean;
};

// Election configurations with contract addresses
const electionConfigs = [
  {
    year: 2025,
    title: '2025 General Himatif Election',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '', // Current election
    candidates: [
      {
        id: 1,
        name: 'Rizky Pratama',
        party: 'Bidang Keilmuan dan Penelitian',
        image: 'https://avatar.iran.liara.run/public/5',
        bio: 'Rizky Pratama adalah mahasiswa Informatika yang aktif dalam penelitian kecerdasan buatan dan pengembangan teknologi terbaru.',
        votes: 0
      },
      {
        id: 2,
        name: 'Siti Nurhaliza',
        party: 'Bidang Kemahasiswaan',
        image: 'https://avatar.iran.liara.run/public/98',
        bio: 'Siti Nurhaliza adalah mahasiswa Informatika yang peduli pada pengembangan soft skill dan kesejahteraan mahasiswa di kampus.',
        votes: 0
      },
      {
        id: 3,
        name: 'Andi Wijaya',
        party: 'Bidang Minat dan Bakat',
        image: 'https://avatar.iran.liara.run/public/9',
        bio: 'Andi Wijaya adalah mahasiswa Informatika yang aktif dalam komunitas programming dan hobi mengembangkan game serta aplikasi mobile.',
        votes: 0
      }
    ]
  },
  {
    year: 2024,
    title: '2024 General Himatif Election',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_LOCAL || '',
    candidates: [
      {
        id: 1,
        name: 'Budi Santoso',
        party: 'Bidang Keilmuan dan Penelitian',
        image: 'https://avatar.iran.liara.run/public/11',
        bio: 'Budi Santoso adalah mahasiswa Informatika yang berfokus pada pengembangan perangkat lunak open source dan riset teknologi cloud.',
        votes: 0
      },
      {
        id: 2,
        name: 'Dewi Lestari',
        party: 'Bidang Kaderisasi',
        image: 'https://avatar.iran.liara.run/public/97',
        bio: 'Dewi Lestari aktif dalam organisasi kemahasiswaan dan memiliki minat besar pada pengembangan kepemimpinan serta kegiatan sosial kampus.',
        votes: 0
      },
      {
        id: 3,
        name: 'Agus Wijaya',
        party: 'Bidang Minat dan Bakat',
        image: 'https://avatar.iran.liara.run/public/33',
        bio: 'Agus Wijaya adalah mahasiswa yang gemar berkompetisi dalam lomba programming dan aktif membina komunitas teknologi di kampus.',
        votes: 0
      }
    ]
  },
  {
    year: 2023,
    title: '2023 General Himatif Election',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '', // Replace with actual address
    candidates: [
      {
        id: 1,
        name: 'Ahmad Fauzi',
        party: 'Bidang Keilmuan dan Penelitian',
        image: 'https://avatar.iran.liara.run/public/21',
        bio: 'Ahmad Fauzi adalah mahasiswa Informatika yang aktif dalam pengembangan perangkat lunak dan penelitian teknologi blockchain.',
        votes: 0
      },
      {
        id: 2,
        name: 'Putri Maharani',
        party: 'Bidang Sosial dan Masyarakat',
        image: 'https://avatar.iran.liara.run/public/88',
        bio: 'Putri Maharani adalah mahasiswa Informatika yang berfokus pada kegiatan sosial dan pengembangan kepemimpinan mahasiswa.',
        votes: 0
      }
    ]
  },
  {
    year: 2022,
    title: '2022 General Himatif Election',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '', // Replace with actual address
    candidates: [
      {
        id: 1,
        name: 'Budi Santoso',
        party: 'Bidang Keilmuan dan Penelitian',
        image: 'https://avatar.iran.liara.run/public/11',
        bio: 'Budi Santoso adalah mahasiswa Informatika yang berfokus pada pengembangan perangkat lunak open source dan riset teknologi cloud.',
        votes: 0
      },
      {
        id: 3,
        name: 'Agus Wijaya',
        party: 'Bidang Minat dan Bakat',
        image: 'https://avatar.iran.liara.run/public/33',
        bio: 'Agus Wijaya adalah mahasiswa yang gemar berkompetisi dalam lomba programming dan aktif membina komunitas teknologi di kampus.',
        votes: 0
      }
    ]
  },
  {
    year: 2021,
    title: '2021 General Himatif Election',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '', // Replace with actual address
    candidates: [
      {
        id: 2,
        name: 'Agus Wijaya',
        party: 'Bidang Minat dan Bakat',
        image: 'https://avatar.iran.liara.run/public/33',
        bio: 'Agus Wijaya adalah mahasiswa yang gemar berkompetisi dalam lomba programming dan aktif membina komunitas teknologi di kampus.',
        votes: 0
      },
      {
        id: 3,
        name: 'Ahmad Fauzi',
        party: 'Bidang Keilmuan dan Penelitian',
        image: 'https://avatar.iran.liara.run/public/21',
        bio: 'Ahmad Fauzi adalah mahasiswa Informatika yang aktif dalam pengembangan perangkat lunak dan penelitian teknologi blockchain.',
        votes: 0
      }
    ]
  }
];

const getPartyColor = (party: string) => {
  switch (party) {
    case 'Bidang Keilmuan dan Penelitian':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700 hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300';
    case 'Bidang Kemahasiswaan':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700 hover:bg-green-200 hover:text-green-900 dark:hover:bg-green-800 dark:hover:text-green-300';
    case 'Bidang Minat dan Bakat':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700 hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-800 dark:hover:text-purple-300';
    case 'Bidang Kaderisasi':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700 hover:bg-orange-200 hover:text-orange-900 dark:hover:bg-orange-800 dark:hover:text-orange-300';
    case 'Bidang Sosial dan Masyarakat':
      return 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-700 hover:bg-pink-200 hover:text-pink-900 dark:hover:bg-pink-800 dark:hover:text-pink-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-300';
  }
};

// Function to get registered voters count from API
const getRegisteredVotersCount = async (): Promise<number> => {
  try {
    const response = await fetch('/api/dashboard/voters');
    if (!response.ok) {
      throw new Error('Failed to fetch voters count');
    }
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching registered voters:', error);
    return 1000; // fallback to default value
  }
};

// Function to get votes for a candidate from a specific contract
const getVotesForCandidateFromContract = async (candidateId: number, contractAddress: string): Promise<number> => {
  if (!window.ethereum || !contractAddress) return 0;
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractJson.abi, provider);
    const votes: bigint = await contract.getVotes(candidateId);
    return Number(votes);
  } catch (error) {
    console.error(`Error fetching votes for candidate ${candidateId} from contract ${contractAddress}:`, error);
    return 0;
  }
};

// Function to get total votes from a specific contract
const getTotalVotesFromContract = async (contractAddress: string): Promise<number> => {
  if (!window.ethereum || !contractAddress) return 0;
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractJson.abi, provider);
    const totalVotes: bigint = await contract.getTotalVotesCast();
    return Number(totalVotes);
  } catch (error) {
    console.error(`Error fetching total votes from contract ${contractAddress}:`, error);
    return 0;
  }
};

export default function ElectionHistory() {
  const [electionHistory, setElectionHistory] = useState<ElectionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data for all elections
  useEffect(() => {
    const fetchAllElectionData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch registered voters count once for all elections
        const registeredVoters = await getRegisteredVotersCount();
        
        const updatedElections = await Promise.all(
          electionConfigs.map(async (config) => {
            // Skip if no contract address
            if (!config.contractAddress) {
              return {
                ...config,
                candidates: config.candidates,
                winner: null,
                totalVotes: 0,
                turnout: 0,
                isLoading: false
              };
            }

            // Fetch votes for each candidate
            const candidatesWithVotes = await Promise.all(
              config.candidates.map(async (candidate) => {
                const votes = await getVotesForCandidateFromContract(candidate.id, config.contractAddress);
                return { ...candidate, votes };
              })
            );

            // Calculate total votes
            const totalVotes = candidatesWithVotes.reduce((sum, candidate) => sum + candidate.votes, 0);

            // Find winner (candidate with most votes)
            const winner = candidatesWithVotes.reduce((prev, current) => 
              (current.votes > prev.votes) ? current : prev
            );

            // Calculate turnout using actual registered voters from API
            const turnout = registeredVoters > 0 ? (totalVotes / registeredVoters) * 100 : 0;

            return {
              ...config,
              candidates: candidatesWithVotes,
              winner: totalVotes > 0 ? winner : null,
              totalVotes,
              turnout: Math.round(turnout * 10) / 10, // Round to 1 decimal
              isLoading: false
            };
          })
        );

        setElectionHistory(updatedElections);
      } catch (error) {
        console.error('Error fetching election data:', error);
        // Set elections with default data if error occurs
        const defaultElections = electionConfigs.map(config => ({
          ...config,
          candidates: config.candidates,
          winner: null,
          totalVotes: 0,
          turnout: 0,
          isLoading: false
        }));
        setElectionHistory(defaultElections);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllElectionData();
  }, []);
  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Election History
              </CardTitle>
              <CardDescription className="text-center">
                View the history of past elections, winners, and results
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Election Results */}
          <div className="space-y-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="flex justify-center md:justify-start">
                        <div className="text-center">
                          <Skeleton className="mx-auto mb-3 h-[150px] w-[150px] rounded-full" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                      </div>
                      <div className="space-y-4 md:col-span-2">
                        <div>
                          <Skeleton className="mb-1 h-8 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Skeleton className="h-20 w-full rounded-lg" />
                          <Skeleton className="h-20 w-full rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              electionHistory.map((election, index) => (
                <Card key={election.year} className="overflow-hidden">
                  <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                          <Trophy className="mr-2 h-5 w-5 text-amber-600 dark:text-amber-400" />
                          {election.title}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="mr-1 h-4 w-4" />
                          {election.year}
                        </CardDescription>
                      </div>
                      <Crown className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {election.winner ? (
                      <div className="grid gap-6 md:grid-cols-3">
                        {/* Winner Photo */}
                        <div className="flex justify-center md:justify-start">
                          <div className="text-center">
                            <Image
                              src={election.winner.image || '/placeholder.svg'}
                              alt={election.winner.name}
                              width={150}
                              height={150}
                              className="mx-auto mb-3 rounded-full border-4 border-amber-200 dark:border-amber-600"
                            />
                            <Badge
                              className={`${getPartyColor(
                                election.winner.party
                              )} border`}
                            >
                              {election.winner.party}
                            </Badge>
                          </div>
                        </div>

                        {/* Winner Details */}
                        <div className="space-y-4 md:col-span-2">
                          <div>
                            <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {election.winner.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              Winner - {election.winner.party}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Votes Received
                              </p>
                              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {election.winner.votes.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {election.totalVotes > 0 
                                  ? ((election.winner.votes / election.totalVotes) * 100).toFixed(1)
                                  : '0.0'
                                }% of total votes
                              </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Election Stats
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {election.totalVotes.toLocaleString()} total votes
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {election.turnout}% turnout
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          No votes recorded for this election yet.
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Contract: {election.contractAddress || 'Not configured'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary Stats */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Election Summary</CardTitle>
              <CardDescription>Overview of all past elections</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {electionHistory.length}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total Elections</p>
                  </div>
                  <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-center">
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {electionHistory.length > 0
                        ? Math.round(
                            electionHistory.reduce((sum, e) => sum + e.turnout, 0) /
                              electionHistory.length
                          )
                        : 0
                      }
                      %
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">Average Turnout</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4 text-center">
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {electionHistory
                        .reduce((sum, e) => sum + e.totalVotes, 0)
                        .toLocaleString()}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Total Votes Cast</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/dashboard/vote">
                <Vote className="mr-2 h-5 w-5" />
                Participate in Current Election
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
