'use client';

import {useParams, useRouter} from 'next/navigation';
import { useState} from 'react';
import { UserAccounts } from '@/features/admin-users/components/UserAccounts';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import {Button} from "@/components/ui/button";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import CreateAccountModal from "@/features/admin-users/components/CreateAccountModal";
import { useUserAccounts } from '@/features/admin-users/hooks/useUserAccounts';
import {useUserById} from "@/features/admin-users/hooks/useUserById";
import {useDeleteAccount} from "@/features/admin-users/hooks/useDeleteAccount";
import {useToggleAccountStatus} from "@/features/admin-users/hooks/useToggleAccountStatus";
import {Account} from "@/types";
import AccountActionPanel from "@/features/admin-users/components/AccountActionPanel";
import {deposit, transfer, withdraw} from "@/lib/api/accountTransactionApi";
import {toast} from "@/hooks/use-toast";

export default function UserAccountsPage() {
    const { id } = useParams();
    const userId = Number(id);
    const router = useRouter();

    const { data: user, isLoading: isUserLoading } = useUserById(userId);
    const { accounts, isLoading: isAccountsLoading, createAccount, refetch } = useUserAccounts(userId);

    const deleteAccountMutation = useDeleteAccount();
    const toggleStatusMutation = useToggleAccountStatus();

    const [showModal, setShowModal] = useState(false);
    const [ibanToDelete, setIbanToDelete] = useState<string | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const handleAccountAction = (
        action: 'toggle-status' | 'delete',
        iban: string
    ) => {
        if (action === 'delete') {
            setIbanToDelete(iban);
        } else {
            const account = accounts.find((acc) => acc.iban === iban);
            if (!account) return;

            const nextStatus = account.status === 'ACTIVE' ? 'close' : 'open';
            toggleStatusMutation.mutate(
                { iban, status: nextStatus },
                {
                    onSuccess: () => refetch(),
                    onError: async (error) => {
                        if (error instanceof Response && error.status === 409) {
                            const data = await error.json();
                            if (data?.errorCode === 'BUSINESS_ERROR') {
                                toast({
                                    title: 'Cannot close account',
                                    description: `${data.message} (IBAN: ${data.details?.iban})`,
                                    variant: 'destructive',
                                });
                                return;
                            }
                        }

                        toast({
                            title: 'Failed to change status',
                            description: 'Unexpected error occurred',
                            variant: 'destructive',
                        });
                    }
                }
            );
        }
    };


    const confirmDelete = () => {
        if (ibanToDelete) {
            deleteAccountMutation.mutate(
                { userId, iban: ibanToDelete },
                {
                    onSuccess: () => {
                        setIbanToDelete(null);
                        refetch();
                    },
                }
            );
        }
    };

    if (isUserLoading || !user) return <div className="p-6">Loading user...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{user.fullName} accounts</h2>
                <div className="space-x-2">
                    <Button variant="outline" onClick={() => router.push('/admin/users')}>Back</Button>
                    <Button onClick={() => setShowModal(true)}>Create Account</Button>
                </div>
            </div>

            <Tabs defaultValue="accounts" className="w-full">
                <TabsList className="mb-4 flex gap-2 border-b border-gray-300 justify-start items-stretch h-12">
                    <TabsTrigger
                        value="info"
                        className="h-full px-4 py-0 font-semibold text-gray-700 rounded-md transition-colors hover:bg-gray-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        onClick={() => router.push(`/admin/users/${userId}/info`)}
                    >
                        Personal Info
                    </TabsTrigger>
                    <TabsTrigger
                        value="accounts"
                        className="h-full px-4 py-0 font-semibold text-gray-700 rounded-md transition-colors hover:bg-gray-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        onClick={() => router.push(`/admin/users/${userId}/accounts`)}
                    >
                        Bank Accounts
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {isAccountsLoading ? (
                <div className="p-4">Loading accounts...</div>
            ) : (
                <UserAccounts
                    accounts={accounts}
                    isLoading={false}
                    onAccountAction={handleAccountAction}
                    onSelectAccount={setSelectedAccount}
                />
            )}

            <ConfirmDialog
                open={!!ibanToDelete}
                title="Delete Account"
                description={`Delete account ${ibanToDelete}?`}
                onConfirm={confirmDelete}
                onCancel={() => setIbanToDelete(null)}
            />

            <CreateAccountModal
                open={showModal}
                onOpenChangeAction={setShowModal}
                onCreateAction={(currency) => {
                    createAccount(currency);
                    setShowModal(false);
                    refetch();
                }}
            />
            {selectedAccount && (
                <AccountActionPanel
                    account={selectedAccount}
                    onClose={() => setSelectedAccount(null)}
                    onDeposit={(amount) => {
                        deposit(selectedAccount.iban, selectedAccount.currency, amount).then(() => {
                            refetch();
                            setSelectedAccount(null);
                        });
                    }}
                    onWithdraw={(amount) => {
                        withdraw(selectedAccount.iban, selectedAccount.currency, amount).then(() => {
                            refetch();
                            setSelectedAccount(null);
                        });
                    }}
                    onTransfer={(toIban, amount) => {
                        transfer(selectedAccount.iban, toIban, selectedAccount.currency, amount).then(()  => {
                            refetch();
                            setSelectedAccount(null);
                        });
                    }}
                />
            )}
        </div>
    );
}