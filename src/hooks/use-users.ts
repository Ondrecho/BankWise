'use client';
import { useState, useEffect } from 'react';
import { User, Account, Role } from '@/types';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/users-service';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function useUsers() {
    const { toast } = useToast();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
    const [availableRoles, setAvailableRoles] = useState<Role[]>([
        { id: 1, name: 'individual', description: 'Частное лицо' },
        { id: 2, name: 'business', description: 'Юридическое лицо' },
        { id: 3, name: 'admin', description: 'Администратор' },
        { id: 4, name: 'support', description: 'Поддержка' },
        { id: 6, name: 'auditor', description: 'Аудитор' },
        { id: 7, name: 'auditor2', description: 'Аудитор2' },
        { id: 8, name: 'auditor3', description: 'Аудитор3' },
        { id: 9, name: 'auditor4', description: 'Аудитор4' }
    ]);

    // Initial mock data
    useEffect(() => {
        setUsers([{
            id: 1,
            fullName: "John Doe",
            email: "john@example.com",
            dateOfBirth: "1990-01-01",
            active: true,
            roles: [{ id: 3, name: 'admin', description: 'Администратор' }],
            accounts: [{
                id: 1,
                iban: "BY00OLMP31310000000000000001",
                balance: 1000,
                currency: "USD",
                status: "ACTIVE",
                createdAt: "2023-01-01",
                userId: 1
            }]
        }]);
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // В будущем можно будет переключиться на реальный API
            // const data = await getUsers();
            // setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
            toast({ title: "Error", description: "Failed to fetch users" });
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
    };

    const handleUserDelete = (user: User | null) => {
        if (user) {
            setUserToDelete(user);
        } else {
            setUserToDelete(null);
        }
    };

    const confirmUserDelete = async () => {
        if (userToDelete) {
            try {
                // В будущем: await deleteUser(userToDelete.id);
                setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
                toast({ title: "User deleted successfully" });
            } catch (err) {
                toast({
                    title: "Error",
                    description: err instanceof Error ? err.message : "Failed to delete user",
                    variant: "destructive"
                });
            } finally {
                setUserToDelete(null);
            }
        }
    };

    const handleBackToList = () => {
        setSelectedUser(null);
        setIsCreating(false);
    };

    const handleCreateUser = () => {
        setIsCreating(true);
        setSelectedUser({
            id: 0,
            fullName: "",
            email: "",
            dateOfBirth: "",
            active: true,
            roles: [],
            accounts: []
        });
    };

    const handleSaveUser = async () => {
        if (!selectedUser) return;

        try {
            if (isCreating) {
                // В будущем: await createUser(selectedUser);
                const newUser = {
                    ...selectedUser,
                    id: Math.max(...users.map(u => u.id)) + 1
                };
                setUsers(prev => [...prev, newUser]);
                toast({ title: "User created successfully" });
            } else {
                // В будущем: await updateUser(selectedUser.id, selectedUser);
                setUsers(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u));
                toast({ title: "User updated successfully" });
            }
            handleBackToList();
        } catch (err) {
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "Failed to save user",
                variant: "destructive"
            });
        }
    };

    const handleCreateAccount = (currency: string) => {
        if (!selectedUser) return;

        try {
            const newAccount: Account = {
                id: Math.max(0, ...selectedUser.accounts?.map(a => a.id) || []) + 1,
                iban: `BY00OLMP313100000000000000${Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4, '0')}`,
                balance: 0,
                currency,
                status: "ACTIVE",
                createdAt: new Date().toISOString(),
                userId: selectedUser.id
            };

            const updatedUser = {
                ...selectedUser,
                accounts: [...(selectedUser.accounts || []), newAccount]
            };

            setSelectedUser(updatedUser);
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            toast({ title: "Account created successfully" });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to create account",
                variant: "destructive"
            });
        }
    };

    const handleAccountAction = (action: 'toggle-status' | 'delete', iban: string) => {
        if (!selectedUser || !selectedUser.accounts) return;

        try {
            if (action === 'toggle-status') {
                const updatedUser = {
                    ...selectedUser,
                    accounts: selectedUser.accounts.map(a =>
                        a.iban === iban
                            ? {
                                ...a,
                                status: a.status === 'ACTIVE' ? 'CLOSED' as const : 'ACTIVE' as const
                            }
                            : a
                    )
                };
                setSelectedUser(updatedUser);
                setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            } else if (action === 'delete')  {
                const account = selectedUser.accounts.find(a => a.iban === iban);
                if (account) {
                    setAccountToDelete(account);
                }
            }
        } catch (err) {
            toast({
                title: "Error",
                description: `Failed to ${action} account`,
                variant: "destructive"
            });
        }
    };

    const confirmAccountDelete = async () => {
        if (!selectedUser || !accountToDelete) return;

        try {
            const updatedAccounts = selectedUser.accounts?.filter(a => a.iban !== accountToDelete.iban) || [];
            const updatedUser = {
                ...selectedUser,
                accounts: updatedAccounts
            };

            setSelectedUser(updatedUser);
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            setAccountToDelete(null);
            toast({ title: "Account deleted successfully" });
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to delete account",
                variant: "destructive"
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('credentials');
        router.push('/auth/login');
        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
        });
    };

    return {
        // State
        users,
        loading,
        error,
        selectedUser,
        isCreating,
        userToDelete,
        accountToDelete,
        availableRoles,

        // Handlers
        setSelectedUser,
        setIsCreating,
        handleUserSelect,
        handleUserDelete,
        confirmUserDelete,
        handleBackToList,
        handleCreateUser,
        handleSaveUser,
        handleCreateAccount,
        handleAccountAction,
        confirmAccountDelete,
        setAccountToDelete,
        handleLogout,

        // API methods (for future use)
        fetchUsers,
        addUser: async (user: Omit<User, 'id'> & { password: string }) => {
            try {
                const newUser = await createUser(user);
                setUsers(prev => [...prev, newUser]);
                return true;
            } catch (err) {
                return false;
            }
        },
        updateUser: async (id: number, user: Partial<User>) => {
            try {
                const updatedUser = await updateUser(id, user);
                setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
                return true;
            } catch (err) {
                return false;
            }
        },
        deleteUser: async (id: number) => {
            try {
                await deleteUser(id);
                setUsers(prev => prev.filter(u => u.id !== id));
                return true;
            } catch (err) {
                return false;
            }
        }
    };
}