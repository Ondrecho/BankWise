'use client';

import { useUsers } from '@/features/admin-users/hooks/use-users';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { UserAccounts } from '@/features/admin-users/components/UserAccounts';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function UserAccountsPage() {
    const {
        users,
        selectedUser,
        setSelectedUser,
        handleCreateAccount,
        handleAccountAction,
        confirmAccountDelete,
        accountToDelete,
        setAccountToDelete,
        handleLogout,
    } = useUsers();

    const { id } = useParams();

    useEffect(() => {
        const user = users.find(u => u.id === Number(id));
        if (user) {
            setSelectedUser(user);
        }
    }, [id, users, setSelectedUser]);

    if (!selectedUser) return <div className="p-6">Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <DashboardHeader onLogoutAction={handleLogout} />
            <main className="flex-1 p-6 space-y-6">
                <h1 className="text-2xl font-semibold mb-4">Bank Accounts for {selectedUser.fullName}</h1>
                <UserAccounts
                    user={selectedUser}
                    onCreateAccountAction={handleCreateAccount}
                    onAccountAction={handleAccountAction}
                />
                <ConfirmDialog
                    open={!!accountToDelete}
                    title="Delete Account"
                    description={`Delete account ${accountToDelete?.iban}?`}
                    onConfirm={confirmAccountDelete}
                    onCancel={() => setAccountToDelete(null)}
                />
            </main>
        </div>
    );
}
