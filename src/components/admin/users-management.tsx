/*
// users-management.tsx

'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { User, Account, Role } from '@/types'
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
} from '@/services/users-service'
import { UsersList } from '@/components/admin/users/UsersList'
import { UserForm } from '@/components/admin/users/user-form-modal'
import { AccountsManagement } from '@/components/admin/users/user-accounts'
import { Button } from '@/components/ui/button'
import { getRoles } from '@/services/roles-service'

export function UsersManagement() {
    const { toast } = useToast()
    const [users, setUsers] = useState<User[]>([])
    const [roles, setRoles] = useState<Role[]>([])

    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [userAccounts, setUserAccounts] = useState<Account[]>([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    useEffect(() => {
        loadUsers()
        loadRoles()
    }, [])

    const loadUsers = async () => {
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (error) {
            toast({
                title: 'Error loading users',
                variant: 'destructive'
            })
        }
    }

    const loadRoles = async () => {
        try {
            const data = await getRoles()
            setRoles(data)
        } catch {
            toast({
                title: 'Failed to load roles',
                variant: 'destructive'
            })
        }
    }

    const handleCreateUser = async (userData: Omit<User, 'id'> & { password: string }) => {
        try {
            const newUser = await createUser(userData)
            setUsers(prev => [...prev, newUser])
            toast({ title: 'User created successfully!' })
            return true
        } catch {
            toast({ title: 'Failed to create user!', variant: 'destructive' })
            return false
        }
    }

    const handleUpdateUser = async (userId: number, userData: Partial<User>) => {
        try {
            const updatedUser = await updateUser(userId, userData)
            setUsers(prev => prev.map(u => (u.id === userId ? updatedUser : u)))
            toast({ title: 'User updated successfully!' })
            return true
        } catch {
            toast({ title: 'Failed to update user!', variant: 'destructive' })
            return false
        }
    }

    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUser(userId)
            setUsers(prev => prev.filter(u => u.id !== userId))
            toast({ title: 'User deleted successfully!' })
        } catch {
            toast({ title: 'Failed to delete user!', variant: 'destructive' })
        }
    }

    const handleViewAccounts = async (user: User) => {
        try {
            const accounts = await getUserAccounts(user.id)
            setUserAccounts(accounts)
            setSelectedUser(user)
        } catch {
            toast({ title: 'Failed to load accounts!', variant: 'destructive' })
        }
    }

    const handleCreateAccount = async (userId: number, currency: string) => {
        try {
            const newAccount = await createAccountForUser(userId, currency)
            setUserAccounts(prev => [...prev, newAccount])
            toast({ title: 'Account created successfully!' })
        } catch {
            toast({ title: 'Failed to create account!', variant: 'destructive' })
        }
    }

    const handleCloseAccount = async (iban: string) => {
        try {
            await closeAccount(iban)
            setUserAccounts(prev =>
                prev.map(acc => (acc.iban === iban ? { ...acc, status: 'CLOSED' } : acc))
            )
            toast({ title: 'Account closed successfully!' })
        } catch {
            toast({ title: 'Failed to close account', variant: 'destructive' })
        }
    }

    const handleOpenAccount = async (iban: string) => {
        try {
            await openAccount(iban)
            setUserAccounts(prev =>
                prev.map(acc => (acc.iban === iban ? { ...acc, status: 'ACTIVE' } : acc))
            )
            toast({ title: 'Account opened successfully!' })
        } catch {
            toast({ title: 'Failed to open account', variant: 'destructive' })
        }
    }

    const handleDeleteAccount = async (iban: string) => {
        try {
            await deleteAccount(iban)
            setUserAccounts(prev => prev.filter(acc => acc.iban !== iban))
            toast({ title: 'Account deleted successfully!' })
        } catch {
            toast({ title: 'Failed to delete account', variant: 'destructive' })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">User Management</h2>
                <Button
                    onClick={() => {
                        setEditingUser(null)
                        setIsFormOpen(true)
                    }}
                >
                    Create New User
                </Button>
            </div>

            <UsersList
                users={users}
                onEdit={(user) => {
                    setEditingUser(user)
                    setIsFormOpen(true)
                }}
                onDelete={handleDeleteUser}
                onViewAccounts={handleViewAccounts}
            />

            <UserForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                user={editingUser || undefined}
                roles={roles}
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
    )
}
*/
