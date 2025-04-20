'use client';

import { Account } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Props {
    account: Account;
    onClose: () => void;
    onDeposit: (amount: number) => void;
    onWithdraw: (amount: number) => void;
    onTransfer: (toIban: string, amount: number) => void;
}

export default function AccountActionPanel({
                                               account,
                                               onClose,
                                               onDeposit,
                                               onWithdraw,
                                               onTransfer,
                                           }: Props) {
    const [operation, setOperation] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [toIban, setToIban] = useState('');

    const handleSubmit = () => {
        const parsedAmount = parseFloat(amount);
        if (!parsedAmount || parsedAmount <= 0) return;

        switch (operation) {
            case 'deposit':
                onDeposit(parsedAmount);
                break;
            case 'withdraw':
                onWithdraw(parsedAmount);
                break;
            case 'transfer':
                if (!toIban) return;
                onTransfer(toIban, parsedAmount);
                break;
        }

        setAmount('');
        setToIban('');
        setOperation(null);
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg space-y-6">
                <DialogHeader>
                    <DialogTitle>{account.iban}</DialogTitle>
                    <DialogTitle className="text-xl">
                        {account.balance} {account.currency} • {account.status}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Label>Operation</Label>
                    <Select onValueChange={setOperation} value={operation ?? ''}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose operation type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="deposit">Deposit</SelectItem>
                            <SelectItem value="withdraw">Withdrawal</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                    </Select>

                    {operation === 'transfer' && (
                        <div className="space-y-2">
                            <Label>recipient IBAN</Label>
                            <Input value={toIban} onChange={(e) => setToIban(e.target.value)} placeholder="IBAN" />
                        </div>
                    )}

                    {operation && (
                        <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                            />
                            <div className="flex justify-end pt-2">
                                <Button onClick={handleSubmit}>Confirm</Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
