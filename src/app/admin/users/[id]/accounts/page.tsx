'use client';

import { useUsers } from '@/features/admin-users/hooks/use-users';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
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
            <main>
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
    );
}
