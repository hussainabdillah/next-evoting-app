'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageContainer from '@/components/layout/page-container';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, HelpCircle, Home, Settings, Users, Vote, Plus } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from '@/components/ui/skeleton';

type User = {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
  walletAddress: string | null
  status: string
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // State untuk validation input
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    submit?: string;
  }>({});

  // Tambahkan state untuk tracking submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // validate email ums student
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const umsStudentRegex = /^[a-l]\d{9}@student\.ums\.ac\.id$/;
    
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    
    if (!umsStudentRegex.test(email)) {
      return "Your email is not a valid UMS student email.";
    }
    
    return null;
  };

  // Tambahkan helper function untuk validasi NIM
  const validateNIM = (email: string) => {
    if (!email.includes('@')) return false;
    
    const nim = email.split('@')[0];
    
    // Cek panjang NIM (10 karakter)
    if (nim.length !== 10) {
      return false;
    }
    
    // Cek karakter pertama (a-l)
    const firstChar = nim[0].toLowerCase();
    if (!/^[a-l]$/.test(firstChar)) {
      return false;
    }
    
    // Cek 9 karakter sisanya adalah angka
    const numbers = nim.slice(1);
    if (!/^\d{9}$/.test(numbers)) {
      return false;
    }
    
    return true;
  };

  // add user
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    password: string;
  }>({ name: '', email: '', password: '' })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // handle add user
  const handleAddUser = async () => {
    setIsSubmitting(true);
    const errors: typeof formErrors = {};
    
    // Validasi semua field
    if (!newUser.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!newUser.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailError = validateEmail(newUser.email);
      if (emailError) {
        errors.email = emailError;
      } else if (!validateNIM(newUser.email)) {
        errors.email = "Student number must be 10 characters: first letter (a-l) + 9 digits";
      }
    }
    
    if (!newUser.password) {
      errors.password = "Password is required";
    } else if (newUser.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    
    // Set errors dan return jika ada
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return; // Form tetap terbuka dengan error messages
    }
  
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setFormErrors({ submit: errorData.error || 'Failed to add user' });
        setIsSubmitting(false);
        return;
      }
  
      const createdUser = await response.json();
      setUsers(prev => [...prev, createdUser]);
      setNewUser({ name: '', email: '', password: '' });
      setFormErrors({});
      
      // ✅ Tutup dialog dan show success toast
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: `${createdUser.name} has been added successfully.`,
      });
    } catch (error: any) {
      console.error(error);
      setFormErrors({ submit: error.message || "Something went wrong while adding the user." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function untuk reset form
  const resetForm = () => {
    setNewUser({ name: '', email: '', password: '' });
    setFormErrors({});
    setIsSubmitting(false);
  };
  

  // handle toggle status ui
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Verified' ? 'Not Verified' : 'Verified';
  
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to update status');
      }
  
      const updatedUser = await res.json();
  
      setUsers(prev =>
        prev.map(user => (user.id === userId ? { ...user, status: updatedUser.status } : user))
      );
  
      toast({
        title: "Status Updated",
        description: `User status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Failed to update user status', error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Users Management</h1>
          <Button
              variant="outline"
              size="sm" className="px-3"
              onClick={() => setIsAddDialogOpen(true)}
            >
            <Plus className="w-4 h-4 mr-1" />
            Add Users
              </Button>
            </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Users List</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) {
                  resetForm();
                }
              }}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Fill all fields to create a new user.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => {
                          setNewUser({ ...newUser, name: e.target.value });
                          if (formErrors.name) {
                            setFormErrors({ ...formErrors, name: undefined });
                          }
                        }}
                        placeholder="Enter full name"
                        className={formErrors.name ? "border-red-500 focus:border-red-500" : ""}
                      />
                      {formErrors.name && (
                        <p className="text-sm text-red-500">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => {
                          setNewUser({ ...newUser, email: e.target.value });
                          if (formErrors.email) {
                            setFormErrors({ ...formErrors, email: undefined });
                          }
                        }}
                        placeholder="l200210000@student.ums.ac.id"
                        className={formErrors.email ? "border-red-500 focus:border-red-500" : ""}
                      />
                      {formErrors.email && (
                        <p className="text-sm text-red-500">{formErrors.email}</p>
                      )}
                      {/* <div className="text-xs text-gray-500 space-y-1">
                        <p>Format: [letter][9 digits]@student.ums.ac.id</p>
                        <p>• First letter: a-l (e.g., a, b, c, ..., l)</p>
                        <p>• Example: l200214201@student.ums.ac.id</p>
                      </div> */}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="password">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => {
                          setNewUser({ ...newUser, password: e.target.value });
                          if (formErrors.password) {
                            setFormErrors({ ...formErrors, password: undefined });
                          }
                        }}
                        placeholder="Minimum 6 characters"
                        className={formErrors.password ? "border-red-500 focus:border-red-500" : ""}
                      />
                      {formErrors.password && (
                        <p className="text-sm text-red-500">{formErrors.password}</p>
                      )}
                    </div>
                    {/* General submit error */}
                    {formErrors.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-600">{formErrors.submit}</p>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                    onClick={handleAddUser}
                    disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add User"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Created date</TableHead>
                    {/* <TableHead className="hidden md:table-cell">Wallet address</TableHead> */}
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-20 md:w-32" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-48" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                          {/* <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell> */}
                          <TableCell><Skeleton className="h-4 w-16 md:w-20" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-16 md:w-20" /></TableCell>
                        </TableRow>
                      ))
                    : users.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name ?? 'Unnamed User'}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Intl.DateTimeFormat('en-US', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }).format(new Date(user.createdAt))}
                          </TableCell>
                          {/* <TableCell className="hidden md:table-cell">{user.walletAddress || 'Not Connected'}</TableCell> */}
                          <TableCell>
                            <span className={`px-2 py-1 rounded-sm text-xs font-semibold whitespace-nowrap ${
                              user.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(user.id, user.status)}
                            >
                              {user.status === 'Verified' ? 'Unverify' : 'Verify'}
                            </Button>
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
  );
}