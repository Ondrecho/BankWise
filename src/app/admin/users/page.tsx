'use client';

import { useUsers } from '@/features/admin-users/hooks/use-users';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { Button } from '@/components/ui/button';
import { UserList } from '@/features/admin-users/components/UserList';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
    const {
        users,
        userToDelete,
        setUserToDelete,
        confirmUserDelete,
        handleUserDelete,
        handleUserSelect,
        handleCreateUser,
        handleLogout,
    } = useUsers();

    const router = useRouter();

    const handleClick = (user: any) => {
        handleUserSelect(user);
        router.push(`/admin/users/${user.id}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <DashboardHeader onLogoutAction={handleLogout} />
            <main className="flex-1 p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">User Management</h1>
                    <Button onClick={handleCreateUser}>Create New User</Button>
                </div>
                <UserList users={users} onSelect={handleClick} onDelete={handleUserDelete} />
                <ConfirmDialog
                    open={!!userToDelete}
                    title="Delete User"
                    description={`Are you sure to delete ${userToDelete?.fullName}?`}
                    onConfirm={confirmUserDelete}
                    onCancel={() => setUserToDelete(null)}
                />
            </main>
        </div>
    );
}
