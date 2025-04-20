'use client';

import { useEffect, useState } from 'react';
import { fetchRoles } from '@/lib/api/roleApi';
import { createRole, updateRole, deleteRole } from '@/lib/api/roleApi';
import { Role } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function AdminRolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [newRole, setNewRole] = useState('');
    const [editing, setEditing] = useState<number | null>(null);
    const [editedName, setEditedName] = useState('');

    const loadRoles = async () => {
        try {
            const data = await fetchRoles();
            setRoles(data);
        } catch {
            toast({ title: 'Failed to load roles', variant: 'destructive' });
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    const handleCreate = async () => {
        if (!newRole.trim()) return;
        try {
            await createRole(newRole);
            setNewRole('');
            await loadRoles();
            toast({ title: 'Role created' });
        } catch {
            toast({ title: 'Failed to create role', variant: 'destructive' });
        }
    };

    const handleUpdate = async (id: number) => {
        if (!editedName.trim()) return;
        try {
            await updateRole(id, editedName);
            setEditing(null);
            setEditedName('');
            await loadRoles();
            toast({ title: 'Role updated' });
        } catch {
            toast({ title: 'Failed to update role', variant: 'destructive' });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteRole(id);
            await loadRoles();
            toast({ title: 'Role deleted' });
        } catch {
            toast({ title: 'Failed to delete role', variant: 'destructive' });
        }
    };

    const cleanName = (name: string) => name.replace(/^ROLE_/, '').toLowerCase();

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Roles Management</h2>

            <div className="flex items-center gap-4">
                <Input
                    placeholder="New role (e.g. manager)"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                />
                <Button onClick={handleCreate}>Add Role</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => (
                    <Card key={role.id}>
                        <CardContent className="p-4 space-y-2 ">
                            {editing === role.id ? (
                                <>
                                    <Input
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                    />
                                    {typeof role.usersCount === 'number' && (
                                        <div className="text-sm text-muted-foreground">
                                            Assigned to {role.usersCount} {role.usersCount === 1 ? 'user' : 'users'}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button size="sm"
                                                onClick={() => handleUpdate(role.id)}>
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditing(null);
                                                setEditedName('');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="font-semibold">{cleanName(role.name)}</div>
                                    {typeof role.usersCount === 'number' && (
                                        <div className="text-sm text-muted-foreground">
                                            Assigned to {role.usersCount} {role.usersCount === 1 ? 'user' : 'users'}
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditing(role.id);
                                                setEditedName(cleanName(role.name));
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(role.id)}
                                            disabled={role.usersCount !== undefined && role.usersCount > 0}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                ))}
            </div>
        </div>
    );
}
