/*
'use client'
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/types";
import { getRoles, createRole, updateRole, deleteRole } from "@/services/roles-service";
import { RolesList } from "@/components/admin/roles/RolesList";
import { RoleFormModal } from "@/components/admin/roles/role-form-modal";
import { Button } from "@/components/ui/button";

export function RolesManagement() {
    const { toast } = useToast();
    const [roles, setRoles] = useState<Role[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const loadRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            toast({
                title: "Error loading roles",
                variant: "destructive",
            });
        }
    };

    const handleCreateRole = async (roleName: string) => {
        try {
            const newRole = await createRole({ name: roleName });
            setRoles([...roles, newRole]);
            toast({
                title: 'Role created successfully!',
            });
            return true;
        } catch (error) {
            toast({
                title: 'Failed to create role!',
                variant: 'destructive',
            });
            return false;
        }
    };

    const handleUpdateRole = async (roleId: number, roleName: string) => {
        try {
            const updatedRole = await updateRole(roleId, { name: roleName });
            setRoles(roles.map(r => r.id === roleId ? updatedRole : r));
            toast({
                title: 'Role updated successfully!',
            });
            return true;
        } catch (error) {
            toast({
                title: 'Failed to update role!',
                variant: 'destructive',
            });
            return false;
        }
    };

    const handleDeleteRole = async (roleId: number) => {
        try {
            await deleteRole(roleId);
            setRoles(roles.filter(r => r.id !== roleId));
            toast({
                title: 'Role deleted successfully!',
            });
        } catch (error) {
            toast({
                title: 'Failed to delete role!',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Role Management</h2>
                <Button
                    onClick={() => {
                        setEditingRole(null);
                        setIsFormOpen(true);
                    }}
                >
                    Create New Role
                </Button>
            </div>

            <RolesList
                roles={roles}
                onEdit={(role: Role) => {
                    setEditingRole(role);
                    setIsFormOpen(true);
                }}
                onDelete={handleDeleteRole}
            />

            <RoleFormModal
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                role={editingRole || undefined}
                onCreate={handleCreateRole}
                onUpdate={handleUpdateRole}
            />
        </div>
    );
}*/
