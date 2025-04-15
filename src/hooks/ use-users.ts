import { useState, useEffect } from 'react';
import { User } from "@/types";
import { getUsers, createUser, updateUser, deleteUser } from "@/services/users-service";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const addUser = async (userData: Omit<User, 'id'> & { password: string }) => {
        try {
            const newUser = await createUser({
                ...userData,
                roles: userData.roles || [] // Добавляем roles если их нет
            });
            setUsers(prev => [...prev, newUser]);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create user');
            return false;
        }
    };

    const editUser = async (id: number, userData: Partial<User>) => {
        try {
            const updatedUser = await updateUser(id, userData);
            setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update user');
            return false;
        }
    };

    const removeUser = async (id: number) => {
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user');
            return false;
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, error, addUser, editUser, removeUser, refresh: fetchUsers };
}