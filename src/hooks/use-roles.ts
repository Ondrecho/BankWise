import { useState, useEffect } from 'react';
import { Role } from "@/types";
import { getRoles, createRole, updateRole, deleteRole } from "@/services/roles-service";

export function useRoles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch roles');
        } finally {
            setLoading(false);
        }
    };

    const addRole = async (roleData: Omit<Role, 'id'>) => {
        try {
            const newRole = await createRole(roleData);
            setRoles(prev => [...prev, newRole]);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create role');
            return false;
        }
    };

    const editRole = async (id: number, roleData: Partial<Role>) => {
        try {
            const updatedRole = await updateRole(id, roleData);
            setRoles(prev => prev.map(r => r.id === id ? updatedRole : r));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update role');
            return false;
        }
    };

    const removeRole = async (id: number) => {
        try {
            await deleteRole(id);
            setRoles(prev => prev.filter(r => r.id !== id));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete role');
            return false;
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return { roles, loading, error, addRole, editRole, removeRole, refresh: fetchRoles };
}