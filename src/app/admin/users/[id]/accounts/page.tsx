'use client';

import { useUsers } from '@/features/admin-users/hooks/use-users';
import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import { UserAccounts } from '@/features/admin-users/components/UserAccounts';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import {Button} from "@/components/ui/button";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import CreateAccountModal from "@/features/admin-users/components/CreateAccountModal";

export default function UserAccountsPage() {
    const {
        users,
        selectedUser,
        setSelectedUser,
        handleCreateAccount,
        handleAccountAction,
        confirmAccountDelete,
        handleBackToList,
        accountToDelete,
        setAccountToDelete,
    } = useUsers();

    const { id } = useParams();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const user = users.find(u => u.id === Number(id));
        if (user) {
            setSelectedUser(user);
        }
    }, [id, users]);

    if (!selectedUser) return <div className="p-6">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Top panel: title + actions */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{selectedUser.fullName} accounts</h2>
                <div className="space-x-2">
                    <Button variant="outline" onClick={() => {
                        handleBackToList();
                        router.push('/admin/users');
                    }}>Back</Button>
                    <Button onClick={() => setShowModal(true)}>Create Account</Button>
                </div>
            </div>

            <Tabs defaultValue="accounts" className="w-full">
                <TabsList className="mb-4 flex gap-2 border-b border-gray-300 justify-start items-stretch h-12">
                    <TabsTrigger
                        value="info"
                        className="h-full m-0 flex items-center px-4 py-0 leading-none font-semibold text-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        onClick={() => router.push(`/admin/users/${id}/info`)}
                    >
                        Personal Info
                    </TabsTrigger>
                    <TabsTrigger
                        value="accounts"
                        className="h-full m-0 flex items-center px-4 py-0 leading-none font-semibold text-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        onClick={() => router.push(`/admin/users/${id}/accounts`)}
                    >
                        Bank Accounts
                    </TabsTrigger>
                </TabsList>
            </Tabs>

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

            <CreateAccountModal
                open={showModal}
                onOpenChangeAction={setShowModal}
                onCreateAction={(currency) => {
                    handleCreateAccount(currency);
                    setShowModal(false);
                }}
            />
        </div>
    );
}
