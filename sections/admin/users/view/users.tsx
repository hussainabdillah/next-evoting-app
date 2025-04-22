'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageContainer from '@/components/layout/page-container';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, HelpCircle, Home, Settings, Users, Vote } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"


type User = {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Voter'
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Admin User", email: "admin@example.com", role: "Admin" },
    { id: 2, name: "John Doe", email: "john@example.com", role: "Voter" },
    { id: 3, name: "Jane Smith", email: "jane@example.com", role: "Voter" },
  ])
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', role: 'Voter' })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddUser = () => {
    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
    setUsers([...users, { ...newUser, id }])
    setNewUser({ name: '', email: '', role: 'Voter' })
    setIsAddDialogOpen(false)
    toast({
      title: "User Added",
      description: `${newUser.name} has been added as a ${newUser.role}.`,
    })
  }

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Users Management</h1>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold">Manage Users</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Add New User</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Enter the details for the new user.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: 'Admin' | 'Voter') => setNewUser({...newUser, role: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Voter">Voter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddUser}>Add User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      </PageContainer>
  );
}