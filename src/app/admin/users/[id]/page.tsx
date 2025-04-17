'use client';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/hooks/use-users';
import { UserForm } from '@/components/admin/users/UserForm';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {useState} from "react";
import {Role} from "@/types";

export default function UserDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const {
        users,
        selectedUser,
        setSelectedUser,
        handleSaveUser,
        isCreating,
        availableRoles,
        handleBackToList,
        handleCreateAccount,
        handleAccountAction,
    } = useUsers();

    const user = users.find(u => u.id === Number(params.id)) || selectedUser;

    if (!user) return <div>User not found</div>;

    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="px-4 pt-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">
                        {isCreating ? "Create New User" : user.fullName}
                    </CardTitle>
                    <div className="hidden md:flex gap-2">
                        <Button variant="outline" onClick={() => router.push('/admin/users')}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveUser}>
                            {isCreating ? "Create User" : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-6">
                <UserForm
                    user={user}
                    roles={availableRoles}
                    onChangeAction={setSelectedUser}
                    onSaveAction={handleSaveUser}
                    onBackAction={handleBackToList}
                    onCreateAccountAction={handleCreateAccount}
                    onAccountAction={handleAccountAction}
                />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 px-4 py-4 md:hidden">
                <Button variant="outline" onClick={() => router.push('/admin/users')}>
                    Cancel
                </Button>
                <Button onClick={handleSaveUser}>
                    {isCreating ? "Create User" : "Save Changes"}
                </Button>
            </CardFooter>
        </Card>
    );
}