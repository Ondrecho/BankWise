'use client'
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { User, Account } from "@/types";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserAccounts,
    createAccountForUser,
    closeAccount,
    openAccount,
    deleteAccount
} from "@/services/users-service";
import { UserList } from "@/components/admin/users/UserList";
import { UserFormModal } from "@/components/admin/users/user-form-modal";
import { AccountsManagement } from "@/components/admin/users/user-accounts";
import { Button } from "@/components/ui/button";

export function UsersManagement() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userAccounts, setUserAccounts] = useState<Account[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            toast({
                title: "Error loading users",
                variant: "destructive",
            });
        }
    };

    const handleCreateUser = async (userData: Omit<User, 'id'> & { password: string }) => {
        try {
            const newUser = await createUser(userData);
            setUsers([...users, newUser]);
            toast({
                title: 'User created successfully!',
            });
            return true;
        } catch (error) {
            toast({
                title: 'Failed to create user!',
                variant: 'destructive',
            });
            return false;
        }
    };

    const handleUpdateUser = async (userId: number, userData: Partial<User>) => {
        try {
            const updatedUser = await updateUser(userId, userData);
            setUsers(users.map(u => u.id === userId ? updatedUser : u));
            toast({
                title: 'User updated successfully!',
            });
            return true;
        } catch (error) {
            toast({
                title: 'Failed to update user!',
                variant: 'destructive',
            });
            return false;
        }
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            toast({
                title: 'User deleted successfully!',
            });
        } catch (error) {
            toast({
                title: 'Failed to delete user!',
                variant: 'destructive',
            });
        }
    };

    const handleViewAccounts = async (user: User) => {
        try {
            const accounts = await getUserAccounts(user.id);
            setUserAccounts(accounts);
            setSelectedUser(user);
        } catch (error) {
            toast({
                title: 'Failed to load accounts!',
                variant: 'destructive',
            });
        }
    };

    const handleCreateAccount = async (userId: number, currency: string) => {
        try {
            const newAccount = await createAccountForUser(userId, currency);
            setUserAccounts([...userAccounts, newAccount]);
            toast({
                title: 'Account created successfully!',
            });
        } catch (error) {
            toast({
                title: 'Failed to create account!',
                variant: 'destructive',
            });
        }
    };

    const handleCloseAccount = async (iban: string) => {
        try {
            await closeAccount(iban);
            setUserAccounts(prevAccounts =>
                prevAccounts.map(account =>
                    account.iban === iban ? { ...account, status: "CLOSED" } : account
                )
            );
            toast({ title: "Account closed successfully!" });
        } catch (error) {
            toast({ title: "Failed to close account", variant: "destructive" });
        }
    };

    const handleOpenAccount = async (iban: string) => {
        try {
            await openAccount(iban);
            setUserAccounts(prevAccounts =>
                prevAccounts.map(account =>
                    account.iban === iban ? { ...account, status: "ACTIVE" } : account
                )
            );
            toast({ title: "Account opened successfully!" });
        } catch (error) {
            toast({ title: "Failed to open account", variant: "destructive" });
        }
    };

    const handleDeleteAccount = async (iban: string) => {
        try {
            await deleteAccount(iban);
            setUserAccounts(prevAccounts => prevAccounts.filter(account => account.iban !== iban));
            toast({ title: "Account deleted successfully!" });
        } catch (error) {
            toast({ title: "Failed to delete account", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">User Management</h2>
                <Button
                    onClick={() => {
                        setEditingUser(null);
                        setIsFormOpen(true);
                    }}
                >
                    Create New User
                </Button>
            </div>

            <UserList
                users={users}
                onEdit={(user: User) => {
                    setEditingUser(user);
                    setIsFormOpen(true);
                }}
                onDelete={handleDeleteUser}
                onViewAccounts={handleViewAccounts}
            />

            <UserFormModal
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                user={editingUser || undefined}
                roles={[]} // Здесь должны быть реальные роли
                onCreate={handleCreateUser}
                onUpdate={handleUpdateUser}
            />

            {selectedUser && (
                <AccountsManagement
                    user={selectedUser}
                    accounts={userAccounts}
                    onCreateAccount={handleCreateAccount}
                    onCloseAccount={handleCloseAccount}
                    onOpenAccount={handleOpenAccount}
                    onDeleteAccount={handleDeleteAccount}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
}