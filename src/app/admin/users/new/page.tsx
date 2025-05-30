'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserForm } from '@/features/admin-users/components/UserForm';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import {User as UserAvatar} from "lucide-react";
import {useRolesQuery} from "@/features/admin-users/hooks/useRolesQuery";
import {useCreateUser} from "@/features/admin-users/hooks/useCreateUser";

export default function NewUserPage() {
    const router = useRouter();
    const { data: roles = [] } = useRolesQuery();
    const createUserMutation = useCreateUser();

    const [newUser, setNewUser] = useState<User>({
        id: 0,
        fullName: '',
        email: '',
        dateOfBirth: '',
        active: true,
        roles: [],
        accounts: [],
    });

    const [password, setPassword] = useState('');

    const handleCreate = async () => {
        await createUserMutation.mutateAsync({ ...newUser, password });
        router.push('/admin/users');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Create New User</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] items-start gap-6">
                <UserForm
                    user={newUser}
                    roles={roles}
                    onChangeAction={setNewUser}
                    password={password}
                    onPasswordChange={setPassword}
                />
                <div className="flex flex-col items-center justify-between h-full">
                    <div className="w-48 h-48 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 mb-4">
                        <UserAvatar className="w-full h-full" />
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" onClick={() => router.push('/admin/users')}>Cancel</Button>
                        <Button onClick={handleCreate}>Create User</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}