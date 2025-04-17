'use client';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/hooks/use-users';
import { UserAccounts }  from '@/components/admin/users/UserAccounts';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DeleteAccountDialog } from '@/components/admin/users/DeleteDialogs';
import {useState} from "react";
import CreateAccountModal from "@/components/admin/users/CreateAccountModal";

export default function UserAccountsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const {
        users,
        selectedUser,
        handleCreateAccount,
        accountToDelete,
        confirmAccountDelete,
        setAccountToDelete
    } = useUsers();

    const user = users.find(u => u.id === Number(params.id)) || selectedUser;
    const [showCreateModal, setShowCreateModal] = useState(false);

    if (!user) return <div>User not found</div>;

    const handleAccountAction = (action: 'toggle-status' | 'delete', iban: string) => {
        if (action === 'delete') {
            const account = user.accounts?.find(a => a.iban === iban);
            if (account) setAccountToDelete(account);
        } else {
            // toggle-status будет обрабатываться в useUsers
        }
    };

    return (
        <>
            <Card className="border-none shadow-sm">
                <CardHeader className="px-4 pt-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">
                            Bank Accounts: {user.fullName}
                        </CardTitle>
                        <Button onClick={() => setShowCreateModal(true)}>
                            Create New Account
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="px-4 py-6">
                    <UserAccounts
                        user={user}
                        onCreateAccountAction={handleCreateAccount}
                        onAccountAction={handleAccountAction}
                    />
                </CardContent>
            </Card>

            <DeleteAccountDialog
                account={accountToDelete!}
                open={!!accountToDelete}
                onConfirmAction={confirmAccountDelete}
                onCancelAction={() => setAccountToDelete(null)}
            />
        </>
    );
}