'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {toast} from "@/hooks/use-toast";

export default function CreateAccountModal({
                                               open,
                                               onOpenChangeAction,
                                               onCreateAction
                                           }: {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
    onCreateAction: (currency: string) => void;
}) {
    const [currency, setCurrency] = useState('');

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="BYN">BYN</SelectItem>
                                <SelectItem value="RUB">RUB</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChangeAction(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (currency) {
                                onCreateAction(currency);
                                onOpenChangeAction(false);
                            }
                            else {
                                toast({ title: "Please select a currency", variant: "destructive"});
                            }
                        }}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}