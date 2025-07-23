'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";

interface Candidate {
  id: number;
  name: string;
  party: string;
  image: string;
  bio: string;
  votes: number;
}

interface CellActionProps {
  data: Candidate;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
}

export const CellAction: React.FC<CellActionProps> = ({ data, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    onEdit(data);
  };

  const handleDelete = () => {
    setOpen(true);
  };

  const onConfirm = async () => {
    setLoading(true);
    try {
      onDelete(data);
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast({
        title: "Error",
        description: "Failed to delete candidate.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Delete Candidate"
        description={`Are you sure you want to delete "${data.name}"? This action cannot be undone.`}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
