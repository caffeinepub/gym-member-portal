import React, { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { useAddUser, useEditUser } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppUserRole } from '../../backend';
import { toast } from 'sonner';
import type { User } from '../../backend';

interface UserFormModalProps {
  user: User | null;
  onSuccess: () => void;
}

export default function UserFormModal({ user, onSuccess }: UserFormModalProps) {
  const addUser = useAddUser();
  const editUser = useEditUser();
  const [principalId, setPrincipalId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AppUserRole>(AppUserRole.client);

  useEffect(() => {
    if (user) {
      setPrincipalId(user.id.toString());
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!user && !principalId.trim()) {
      toast.error('Please enter a Principal ID');
      return;
    }

    try {
      let principal: Principal;
      
      if (user) {
        principal = user.id;
      } else {
        try {
          principal = Principal.fromText(principalId);
        } catch {
          toast.error('Invalid Principal ID format');
          return;
        }
      }

      if (user) {
        await editUser.mutateAsync({ id: principal, name, email, role });
        toast.success('User updated successfully');
      } else {
        await addUser.mutateAsync({ id: principal, name, email, role });
        toast.success('User added successfully');
      }

      onSuccess();
    } catch (error) {
      toast.error(user ? 'Failed to update user' : 'Failed to add user');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!user && (
        <div className="space-y-2">
          <Label htmlFor="principalId">Principal ID</Label>
          <Input
            id="principalId"
            placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
            value={principalId}
            onChange={(e) => setPrincipalId(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            The user's Internet Identity Principal ID
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(value) => setRole(value as AppUserRole)}>
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AppUserRole.client}>Client</SelectItem>
            <SelectItem value={AppUserRole.trainer}>Trainer</SelectItem>
            <SelectItem value={AppUserRole.admin}>Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={addUser.isPending || editUser.isPending}>
        {addUser.isPending || editUser.isPending ? 'Saving...' : user ? 'Update User' : 'Add User'}
      </Button>
    </form>
  );
}
