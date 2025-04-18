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
        handleLogout,
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
        <div className="flex flex-col min-h-screen bg-gray-50">
            <DashboardHeader onLogoutAction={handleLogout} />
            <main className="flex-1 p-6">
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
            </main>
        </div>
    );
}
