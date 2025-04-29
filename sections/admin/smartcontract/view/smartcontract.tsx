'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

export default function SmartContractPage() {
  const [contractInfo] = useState({
    address: '0x1234...abcd',
    network: 'Polygon Mumbai',
    owner: '0xAdminWallet...123',
    version: '1.0.0',
    status: 'Active',
  })

  const [stats] = useState({
    candidates: 5,
    totalVotes: 120,
    totalVoters: 200,
    isVotingOpen: true,
  })

  const [transactions] = useState([
    {
      hash: '0xabc123...',
      method: 'startElection',
      status: 'Success',
      timestamp: '2025-04-24 14:00',
    },
    {
      hash: '0xdef456...',
      method: 'addCandidate',
      status: 'Success',
      timestamp: '2025-04-23 10:30',
    },
    {
      hash: '0xghi789...',
      method: 'endElection',
      status: 'Pending',
      timestamp: '2025-04-22 16:45',
    },
  ])

  const participation = Math.round((stats.totalVotes / stats.totalVoters) * 100)

  return (
    <div className="p-6 space-y-6">
      {/* Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Contract Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-semibold">Contract Address:</span> {contractInfo.address}
          </div>
          <div>
            <span className="font-semibold">Network:</span> {contractInfo.network}
          </div>
          <div>
            <span className="font-semibold">Owner Wallet:</span> {contractInfo.owner}
          </div>
          <div>
            <span className="font-semibold">Version:</span> {contractInfo.version}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{' '}
            <Badge variant="outline">{contractInfo.status}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Voting Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Voting Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-semibold">Candidates Registered:</span> {stats.candidates}
          </div>
          <div>
            <span className="font-semibold">Total Votes:</span> {stats.totalVotes}
          </div>
          <div>
            <span className="font-semibold">Total Voters:</span> {stats.totalVoters}
          </div>
          <div>
            <span className="font-semibold">Voting Status:</span>{' '}
            <Badge variant="outline">{stats.isVotingOpen ? 'Open' : 'Closed'}</Badge>
          </div>
          <div className="mt-2">
            <Label>Participation Rate</Label>
            <Progress value={participation} />
            <div className="text-sm text-muted-foreground">{participation}%</div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={() => console.log('Start Election')}>Start Election</Button>
          <Button variant="destructive" onClick={() => console.log('End Election')}>
            End Election
          </Button>
          <Button variant="outline" onClick={() => console.log('Add Candidate')}>
            Add Candidate
          </Button>
          <Button variant="outline" onClick={() => console.log('Reset Votes')}>
            Reset Votes
          </Button>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hash</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>{tx.hash}</TableCell>
                  <TableCell>{tx.method}</TableCell>
                  <TableCell>{tx.status}</TableCell>
                  <TableCell>{tx.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
