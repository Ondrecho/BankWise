'use client'
import { User, Account } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import {
    getUserAccounts,
    createAccountForUser,
    closeAccount,
    openAccount,
    deleteAccount
} from "@/services/users-service";

interface AccountsManagementProps {
    userId?: number;
    user?: User;
    accounts?: Account[];
    onCreateAccount?: (userId: number, currency: string) => Promise<void>;
    onCloseAccount?: (iban: string) => Promise<void>;
    onOpenAccount?: (iban: string) => Promise<void>;
    onDeleteAccount?: (iban: string) => Promise<void>;
    onClose?: () => void;
}

export function AccountsManagement({
                                       userId,
                                       user,
                                       accounts: initialAccounts,
                                       onCreateAccount,
                                       onCloseAccount,
                                       onOpenAccount,
                                       onDeleteAccount,
                                       onClose
                                   }: AccountsManagementProps) {
    const { toast } = useToast();
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts || []);
    const [newAccountCurrency, setNewAccountCurrency] = useState("USD");

    useEffect(() => {
        if (userId && !initialAccounts) {
            loadAccounts();
        }
    }, [userId]);

    const loadAccounts = async () => {
        try {
            if (!userId) return;
            const data = await getUserAccounts(userId);
            setAccounts(data);
        } catch (error) {
            toast({
                title: "Error loading accounts",
                variant: "destructive",
            });
        }
    };

    const handleCreate = async () => {
        if (!userId) return;
        try {
            const newAccount = await createAccountForUser(userId, newAccountCurrency);
            setAccounts([...accounts, newAccount]);
            toast({ title: "Account created successfully!" });
        } catch (error) {
            toast({ title: "Failed to create account", variant: "destructive" });
        }
    };

    const handleClose = async (iban: string) => {
        try {
            if (onCloseAccount) {
                await onCloseAccount(iban);
            } else {
                await closeAccount(iban);
            }
            setAccounts(accounts.map(a => a.iban === iban ? { ...a, status: "CLOSED" } : a));
            toast({ title: "Account closed successfully!" });
        } catch (error) {
            toast({ title: "Failed to close account", variant: "destructive" });
        }
    };

    const handleOpen = async (iban: string) => {
        try {
            if (onOpenAccount) {
                await onOpenAccount(iban);
            } else {
                await openAccount(iban);
            }
            setAccounts(accounts.map(a => a.iban === iban ? { ...a, status: "ACTIVE" } : a));
            toast({ title: "Account opened successfully!" });
        } catch (error) {
            toast({ title: "Failed to open account", variant: "destructive" });
        }
    };

    const handleDelete = async (iban: string) => {
        try {
            if (onDeleteAccount) {
                await onDeleteAccount(iban);
            } else {
                await deleteAccount(iban);
            }
            setAccounts(accounts.filter(a => a.iban !== iban));
            toast({ title: "Account deleted successfully!" });
        } catch (error) {
            toast({ title: "Failed to delete account", variant: "destructive" });
        }
    };

    return (
        <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                    {user ? `Accounts for ${user.fullName}` : "User Accounts"}
                </h3>
                {onClose && (
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                )}
            </div>

            {userId && (
                <div className="flex items-center gap-4">
                    <Select value={newAccountCurrency} onValueChange={setNewAccountCurrency}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="BYN">BYN</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleCreate}>Create Account</Button>
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>IBAN</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accounts.map((account) => (
                        <TableRow key={account.id}>
                            <TableCell>{account.iban}</TableCell>
                            <TableCell>{account.balance}</TableCell>
                            <TableCell>{account.currency}</TableCell>
                            <TableCell>
                                <Badge variant={account.status === "ACTIVE" ? "default" : "destructive"}>
                                    {account.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                {account.status === "ACTIVE" ? (
                                    <Button variant="outline" size="sm" onClick={() => handleClose(account.iban)}>
                                        Close
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => handleOpen(account.iban)}>
                                        Open
                                    </Button>
                                )}
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(account.iban)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}