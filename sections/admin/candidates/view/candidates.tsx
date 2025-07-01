'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { MoreHorizontal, Pencil, Trash, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Candidate = {
  id: number;
  name: string;
  party: string;
  image: string;
  bio: string;
  votes: number;
};

export default function CandidatesManagementPage() {
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(
    null
  );
  const [deletingCandidate, setDeletingCandidate] = useState<Candidate | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [newCandidate, setNewCandidate] = useState<Candidate>({
    id: Date.now(),
    name: '',
    party: '',
    image: '',
    bio: '',
    votes: 0,
  })

  const resetForm = () => {
    setNewCandidate({
      id: Date.now(),
      name: '',
      party: '',
      image: '',
      bio: '',
      votes: 0,
    });
    setSelectedFile(null);
  };

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // skeleton state
  const [isLoading, setIsLoading] = useState(true)

  // state file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  // Fetch candidates from API
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/candidates');
      const data = await res.json();
      setCandidates(data);
    } catch (error) {
      console.error("Failed to fetch candidates", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSaveCandidate = async () => {
    if (!editingCandidate?.name || !editingCandidate?.party || !editingCandidate?.bio) {
      toast({
        title: "Validation Error",
        description: "Name, Party, and Bio fields are required.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", editingCandidate.name);
    formData.append("party", editingCandidate.party);
    formData.append("bio", editingCandidate.bio);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    
    try {
    const res = await fetch(`/api/candidates/${editingCandidate.id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      toast({
        title: "Candidate Updated",
        description: `${editingCandidate.name}'s information has been updated.`,
      });
      await fetchCandidates();
      setIsEditDialogOpen(false);
      setEditingCandidate(null);
      setSelectedFile(null);
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update candidate. Please try again.",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "Something went wrong.",
      variant: "destructive",
    });
  }
  };
  

  const handleDeleteCandidate = async (id: number) => {
    const res = await fetch(`/api/candidates/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      toast({ title: 'Candidate Deleted' });
      fetchCandidates();
    }
  };

  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.party || !newCandidate.bio) {
      toast({
        title: "Validation Error",
        description: "Name, Party, and Bio fields are required.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile) {
    toast({
      title: "Validation Error",
      description: "Image is required.",
      variant: "destructive",
    });
    return;
  }

    const formData = new FormData();
    formData.append("name", newCandidate.name);
    formData.append("party", newCandidate.party);
    formData.append("bio", newCandidate.bio);
    formData.append("image", selectedFile);
  
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(newCandidate),
        body: formData
      });
  
      if (res.ok) {
        setIsAddDialogOpen(false)
        toast({ title: "Candidate Added", description: "New candidate has been successfully added." })
        setNewCandidate({ id: Date.now(), name: '', party: '', image: '', bio: '', votes: 0 });
        setSelectedFile(null);
        fetchCandidates();
      } else {
        toast({
          title: "Error",
          description: "Failed to add candidate.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="mx-auto max-w-7xl">
          {/* Candidate Table */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Manage Candidates</h1>
            <Button
              variant="outline"
              size="sm" className="px-3"
              onClick={() => setIsAddDialogOpen(true)}
            >
            <Plus className="w-4 h-4 mr-1" />
            Add Candidate
              </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Candidates List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden md:table-cell">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Party</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="hidden md:table-cell w-[50px] h-[50px] rounded-full" /></TableCell>
                        <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                        <TableCell><Skeleton className="hidden md:table-cell h-4 w-[80px]" /></TableCell>
                        <TableCell className="flex gap-2">
                          <Skeleton className="h-8 w-[60px]" />
                          {/* <Skeleton className="h-8 w-[60px]" /> */}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="hidden md:table-cell">
                        <Image
                          src={candidate.image}
                          alt={candidate.name}
                          width={50}
                          height={50}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </TableCell>
                      <TableCell>{candidate.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{candidate.party}</TableCell>
                      <TableCell className="flex gap-2">
                        {/* Edit Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3"
                          onClick={() => {
                            setEditingCandidate(candidate);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        {/* Delete Button */}
                        <Button
                          variant="destructive"
                          size="sm" 
                          className="px-3"
                          onClick={() => {
                            setDeletingCandidate(candidate);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          {editingCandidate && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Candidate</DialogTitle>
                  <DialogDescription>
                    Update candidate information below
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="name">
                    Candidate Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Name"
                    value={editingCandidate.name}
                    onChange={(e) =>
                      setEditingCandidate({ ...editingCandidate, name: e.target.value })
                    }
                  />
                  <Label htmlFor="party">
                    Candidate Party <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="party"
                    placeholder="Party"
                    value={editingCandidate.party}
                    onChange={(e) =>
                      setEditingCandidate({ ...editingCandidate, party: e.target.value })
                    }
                  />
                  <Label htmlFor="picture">
                    Image <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="picture"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        setEditingCandidate({ ...editingCandidate, image: e.target.value });
                      }
                    }}
                  />
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Description"
                    value={editingCandidate.bio}
                    onChange={(e) =>
                      setEditingCandidate({ ...editingCandidate, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveCandidate}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Add Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Candidate</DialogTitle>
                <DialogDescription>Fill out the form to add a new candidate.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Label htmlFor="name">
                  Candidate Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Name"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                />
                <Label htmlFor="party">
                  Candidate Party <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="party"
                  placeholder="Party"
                  value={newCandidate.party}
                  onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                />
                <Label htmlFor="picture">
                  Image <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="picture"
                  accept=".jpg ,.jpeg, .png" 
                  type="file"
                  placeholder="Image URL"
                  value={newCandidate.image}
                  onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    setNewCandidate({ ...newCandidate, image: e.target.value });
                  }
                }}
                />
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Insert candidate description"
                  value={newCandidate.bio}
                  onChange={(e) => setNewCandidate({ ...newCandidate, bio: e.target.value })}
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async() => {
                    // const candidateToAdd = { ...newCandidate, id: Date.now() }
                    // setCandidates(prev => [...prev, candidateToAdd])
                    // setNewCandidate({ id: Date.now(), name: '', party: '', image: '', bio: '', votes: 0 })
                    await handleAddCandidate()
                  }}
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog
            open={isDeleteDialogOpen && deletingCandidate !== null}
            onOpenChange={(open) => {
              setIsDeleteDialogOpen(open);
              if (!open) setDeletingCandidate(null);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>{deletingCandidate?.name}</strong>? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setDeletingCandidate(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (deletingCandidate) {
                      handleDeleteCandidate(deletingCandidate.id);
                      setIsDeleteDialogOpen(false);
                      setDeletingCandidate(null);
                    }
                  }}
                >
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </PageContainer>
  );
}
