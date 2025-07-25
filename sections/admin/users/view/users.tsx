'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import PageContainer from '@/components/layout/page-container';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, HelpCircle, Home, Settings, Users, Vote, Plus, Search } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from '@/components/ui/skeleton';
import { CellAction } from '../cell-action';

// Temporary pagination - will use proper pagination once it's available
const SimplePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) => (
  <div className="flex items-center justify-center space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage <= 1}
    >
      Previous
    </Button>
    <span className="text-sm text-muted-foreground">
      Page {currentPage} of {totalPages}
    </span>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages}
    >
      Next
    </Button>
  </div>
);

type User = {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
  walletAddress: string | null
  status: string
}

type UsersResponse = {
  users: User[]
  totalUsers: number
  totalPages: number
  currentPage: number
}

export default function UsersManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get URL parameters
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(page)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(search)

  // Breadcrumb items
  const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Users Management', link: '/admin/users' },
  ];

  // State untuk validation input
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    submit?: string;
  }>({});

  // Tambahkan state untuk tracking submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch users from API with pagination and search
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
      })

      const res = await fetch(`/api/users?${queryParams}`)
      if (!res.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data: UsersResponse = await res.json()
      setUsers(data.users)
      setTotalUsers(data.totalUsers)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to fetch users', error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchQuery])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    updateURL(1, query)
  }

  // Update URL parameters
  const updateURL = (newPage: number, newSearch?: string) => {
    const params = new URLSearchParams()
    params.set('page', newPage.toString())
    params.set('limit', limit.toString())
    if (newSearch || searchQuery) {
      params.set('search', newSearch || searchQuery)
    }
    router.push(`/admin/users?${params.toString()}`)
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    updateURL(newPage)
  }

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
      
      // Refresh the users list to get updated pagination
      await fetchUsers();
      
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
  
  // Handle refresh after actions
  const handleRefresh = () => {
    fetchUsers();
  };
  

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage and verify student users
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
          
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="ml-auto"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            {/* <CardTitle>Users ({totalUsers})</CardTitle> */}
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Created date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: limit }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-48" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                        </TableRow>
                      ))
                    : users.length > 0 ? (
                        users.map(user => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name ?? 'Unnamed User'}</TableCell>
                            <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Intl.DateTimeFormat('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }).format(new Date(user.createdAt))}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.status === 'Verified' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <CellAction data={user} onUpdate={handleRefresh} />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
                </div>
                <SimplePagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add User Dialog */}
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
      </div>
    </PageContainer>
  );
}