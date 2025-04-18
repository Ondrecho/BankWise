'use client';
import {User, Role, Account} from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import React, {useState} from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import CreateAccountModal from "@/features/admin-users/components/CreateAccountModal";


interface UserFormProps {
    user: User;
    roles: Role[];
    onChangeAction: (user: User) => void;
    onSaveAction: () => void;
    onBackAction: () => void;
    onCreateAccountAction: (currency: string) => void;
    onAccountAction: (action: 'toggle-status' | 'delete', iban: string) => void;
}

export const UserForm = ({
                             user,
                             roles,
                             onChangeAction,
                             onSaveAction,
                             onBackAction,
                             onCreateAccountAction,
                             onAccountAction
                         }: UserFormProps) => {
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    const [, setNewAccountCurrency] = useState<string>("");

    const roleOptions = roles.map(role => ({
        value: role.id.toString(),
        label: role.description || role.name
    }));

    return (
        <Card className="border-none shadow-none">
            <CardContent className="px-4">
                <Tabs defaultValue="personal" className="w-full">
                    <TabsContent value="personal">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        value={user.fullName}
                                        onChange={(e) =>
                                            onChangeAction({
                                                ...user,
                                                fullName: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={user.email}
                                        onChange={(e) =>
                                            onChangeAction({
                                                ...user,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={user.dateOfBirth}
                                        onChange={(e) =>
                                            onChangeAction({
                                                ...user,
                                                dateOfBirth: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={user.active ? "active" : "blocked"}
                                        onValueChange={(value) =>
                                            onChangeAction({
                                                ...user,
                                                active: value === "active",
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="blocked">Blocked</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="roles">Roles</Label>
                                    <MultiSelect
                                        options={roleOptions}
                                        selected={
                                            user.roles?.map(role => ({
                                                value: role.id.toString(),
                                                label: role.description || role.name
                                            })) || []
                                        }
                                        onChangeAction={(selected) => {
                                            const selectedRoles = roles.filter(role =>
                                                selected.some(s => s.value === role.id.toString())
                                            );
                                            onChangeAction({
                                                ...user,
                                                roles: selectedRoles
                                            });
                                        }}
                                        placeholder="Select roles..."
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="accounts">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Bank Accounts</h3>
                                <Button size="sm" onClick={() => setShowCurrencyModal(true)}>
                                    Create Account
                                </Button>
                            </div>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {user.accounts?.map((account) => (
                                    <Card key={account.id} className="border p-0">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{account.iban}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {account.currency} • {account.balance}
                                                    </p>
                                                    <Badge
                                                        variant={account.status === "ACTIVE" ? "default" : "destructive"}
                                                    >
                                                        {account.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onAccountAction('toggle-status', account.iban)}
                                                    >
                                                        {account.status === "ACTIVE" ? "Close" : "Open"}
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
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
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>

            <CreateAccountModal
                open={showCurrencyModal}
                onOpenChangeAction={setShowCurrencyModal}
                onCreateAction={(currency) => {
                    onCreateAccountAction(currency);
                    setShowCurrencyModal(false);
                    setNewAccountCurrency("");
                }}
            />
        </Card>
    );
};