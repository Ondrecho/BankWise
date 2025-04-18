'use client';
import {Account, User} from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CreateAccountModal from './CreateAccountModal';
import React, {useState} from "react";
import {Card, CardContent} from "@/components/ui/card";

interface UserAccountsProps {
    user: User;
    onCreateAccountAction: (currency: string) => void;
    onAccountAction: (action: 'toggle-status' | 'delete', iban: string) => void;
}

export function UserAccounts({
                                 user,
                                 onCreateAccountAction,
                                 onAccountAction
                             }: UserAccountsProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-4">
            <div className="space-y-2 max-h-80 overflow-y-auto">
                {user.accounts?.map(account => (
                    <Card key={account.id} className="border p-0">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{account.iban}</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={account.status === 'ACTIVE' ? 'default' : 'destructive'}>
                                            {account.status}
                                        </Badge>
                                        <span className="text-sm text-gray-500"> {account.currency} • {account.balance}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => onAccountAction('toggle-status', account.iban)}
                                    >
                                        {account.status === 'ACTIVE' ? 'Close' : 'Open'}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => onAccountAction('delete', account.iban)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <CreateAccountModal
                open={showModal}
                onOpenChangeAction={setShowModal}
                onCreateAction={onCreateAccountAction}
            />
        </div>
    );
}