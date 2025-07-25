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
import { UserCheck, UserX, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  walletAddress: string | null;
}

interface CellActionProps {
  data: User;
  onUpdate: () => void;
}

export const CellAction: React.FC<CellActionProps> = ({ data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<'delete' | 'verify' | 'unverify'>('delete');

  const handleVerifyUnverify = async () => {
    setLoading(true);
    const newStatus = data.status === 'Verified' ? 'Not Verified' : 'Verified';
    
    try {
      const res = await fetch(`/api/users/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      // Call the onUpdate callback to refresh the parent component
      onUpdate();

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      const res = await fetch(`/api/users/${data.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      // Call the onUpdate callback to refresh the parent component
      onUpdate();

      toast({
        title: "User Deleted",
        description: `${data.name} has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Failed to delete user', error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onConfirm = async () => {
    if (actionType === 'delete') {
      await handleDelete();
    } else {
      await handleVerifyUnverify();
      setOpen(false);
    }
  };

  const openDeleteModal = () => {
    setActionType('delete');
    setOpen(true);
  };

  const openVerifyModal = () => {
    setActionType(data.status === 'Verified' ? 'unverify' : 'verify');
    setOpen(true);
  };

  const getModalContent = () => {
    switch (actionType) {
      case 'delete':
        return {
          title: 'Delete User',
          description: `Are you sure you want to delete "${data.name}"? This action cannot be undone.`
        };
      case 'verify':
        return {
          title: 'Verify User',
          description: `Are you sure you want to verify "${data.name}"?`
        };
      case 'unverify':
        return {
          title: 'Unverify User',
          description: `Are you sure you want to unverify "${data.name}"?`
        };
      default:
        return {
          title: 'Confirm Action',
          description: 'Are you sure you want to perform this action?'
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title={modalContent.title}
        description={modalContent.description}
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
          
          <DropdownMenuItem onClick={openVerifyModal}>
            {data.status === 'Verified' ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Unverify
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Verify
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={openDeleteModal} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
