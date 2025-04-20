'use client';

import {Account} from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface UserAccountsProps {
    accounts: Account[];
    isLoading: boolean;
    onAccountAction: (action: 'toggle-status' | 'delete', iban: string) => void;
    onSelectAccount?: (account: Account) => void;
}

export function UserAccounts({
                                 accounts,
                                 isLoading,
                                 onAccountAction,
                                 onSelectAccount
                             }: UserAccountsProps) {
    if (isLoading) return <div className="p-4">Loading accounts...</div>;

    if (!accounts.length) return <p className="text-muted-foreground">No accounts yet</p>;

    return (
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {accounts.map((account) => (
                <Card key={account.id}
                      onClick={() => onSelectAccount?.(account)}
                      className="cursor-pointer border p-0">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{account.iban}</p>
                                <p className="text-sm text-gray-500">
                                    {account.currency} • {account.balance}
                                </p>
                                <Badge variant={account.status === 'ACTIVE' ? 'default' : 'destructive'}>
                                    {account.status}
                                </Badge>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAccountAction('toggle-status', account.iban);
                                    }}
                                >
                                    {account.status === 'ACTIVE' ? 'Close' : 'Open'}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAccountAction('delete', account.iban)
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
