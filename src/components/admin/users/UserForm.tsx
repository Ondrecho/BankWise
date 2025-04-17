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
import CreateAccountModal from "@/components/admin/users/CreateAccountModal";


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
        <Card className="border-none shadow-sm">
            <CardHeader className="px-4 pt-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">
                        {user.id === 0 ? "Create New User" : user.fullName}
                    </CardTitle>
                    <div className="hidden md:flex gap-2">
                        <Button variant="outline" onClick={onBackAction}>Cancel</Button>
                        <Button onClick={onSaveAction}>
                            {user.id === 0 ? "Create User" : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-6">
                <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="mb-4 flex gap-2 border-b border-gray-300 justify-start items-stretch h-12">
                        <TabsTrigger
                            value="personal"
                            className="h-full m-0 flex items-center px-4 py-0 leading-none font-semibold text-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        >
                            Personal Info
                        </TabsTrigger>
                        <TabsTrigger
                            value="accounts"
                            className="h-full m-0 flex items-center px-4 py-0 leading-none font-semibold text-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        >
                            Bank Accounts
                        </TabsTrigger>
                    </TabsList>

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
            <CardFooter className="flex justify-end gap-2 px-4 py-4 md:hidden">
                <Button variant="outline" onClick={onBackAction}>Cancel</Button>
                <Button onClick={onSaveAction}>
                    {user.id === 0 ? "Create User" : "Save Changes"}
                </Button>
            </CardFooter>

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