'use client';

import { useUsers } from '@/features/admin-users/hooks/use-users';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserForm } from '@/features/admin-users/components/UserForm';
import Link from 'next/link';
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function UserInfoPage() {
    const {
        users,
        selectedUser,
        setSelectedUser,
        handleSaveUser,
        handleBackToList,
        availableRoles,
    } = useUsers();

    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        const user = users.find(u => u.id === Number(id));
        if (user) setSelectedUser(user);
    }, [id, users]);

    if (!selectedUser) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Top panel: title + actions */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{selectedUser.fullName}</h2>
                <div className="space-x-2">
                    <Button variant="outline" onClick={() => {
                        handleBackToList();
                        router.push('/admin/users');
                    }}>Cancel</Button>
                    <Button onClick={handleSaveUser}>Save Changes</Button>
                </div>
            </div>

            {/* Tab switches */}
            <Tabs defaultValue="info" className="w-full">
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

            {/* Actual form for Personal Info */}
            <UserForm
                user={selectedUser}
                roles={availableRoles}
                onChangeAction={setSelectedUser}
                onSaveAction={handleSaveUser}
                onBackAction={() => router.push('/admin/users')}
                onCreateAccountAction={() => {}} // not used here
                onAccountAction={() => {}}       // not used here
            />
        </div>
    );
}

