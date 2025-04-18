'use client';

import { useUsers } from '@/features/admin-users/hooks/use-users';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserForm } from '@/features/admin-users/components/UserForm';

export default function NewUserPage() {
    const {
        selectedUser,
        setSelectedUser,
        handleCreateUser,
        handleSaveUser,
        handleBackToList,
        availableRoles,
    } = useUsers();

    const router = useRouter();

    useEffect(() => {
        handleCreateUser();
    }, []);

    if (!selectedUser) return <div>Loading...</div>;

    return (
        <UserForm
            user={selectedUser}
            roles={availableRoles}
            onChangeAction={setSelectedUser}
            onSaveAction={() => {
                handleSaveUser();
                router.push('/admin/users');
            }}
            onBackAction={() => {
                handleBackToList();
                router.push('/admin/users');
            }}
            onCreateAccountAction={() => {}}
            onAccountAction={() => {}}
        />
    );
}
