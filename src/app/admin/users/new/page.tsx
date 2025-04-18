'use client';

import { useUsers } from '@/features/admin-users/hooks/use-users';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserForm } from '@/features/admin-users/components/UserForm';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

export default function NewUserPage() {
    const { handleSaveUser, availableRoles } = useUsers();
    const router = useRouter();

    const [newUser, setNewUser] = useState<User>({
        id: 0,
        fullName: '',
        email: '',
        dateOfBirth: '',
        active: true,
        roles: [],
        accounts: [],
    });

    const handleCreate = async () => {
        await handleSaveUser(newUser);
        router.push('/admin/users');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Create New User</h2>
                <div className="space-x-2">
                    <Button variant="outline" onClick={() => router.push('/admin/users')}>Cancel</Button>
                    <Button onClick={handleCreate}>Create User</Button>
                </div>
            </div>

            <UserForm
                user={newUser}
                roles={availableRoles}
                onChangeAction={setNewUser}
            />
        </div>
    );
}
