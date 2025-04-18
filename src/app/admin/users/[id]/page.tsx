'use client';

import { useUsers } from '@/features/admin-users/hooks/use-users';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { UserForm } from '@/features/admin-users/components/UserForm';

export default function UserDetailsPage() {
    const {
        users,
        selectedUser,
        setSelectedUser,
        handleSaveUser,
        handleBackToList,
        availableRoles,
        handleCreateAccount,
        handleAccountAction,
    } = useUsers();

    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        const user = users.find(u => u.id === Number(id));
        if (user) {
            setSelectedUser(user);
        }
    }, [id, users, setSelectedUser]);

    if (!selectedUser) {
        return <div className="p-6">Loading...</div>;
    }

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
                    onCreateAccountAction={handleCreateAccount}
                    onAccountAction={handleAccountAction}
                />
    );
}
