'use client';

import { useUsers } from '@/features/admin-users/hooks/use-users';
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
    } = useUsers();

    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">User Management</h1>
                <Button onClick={() => router.push('/admin/users/new')}>Create New User</Button>
            </div>
            <UserList users={users} onSelect={(user) => router.push(`/admin/users/${user.id}`)} onDelete={handleUserDelete} />
            <ConfirmDialog
                open={!!userToDelete}
                title="Delete User"
                description={`Are you sure to delete ${userToDelete?.fullName}?`}
                onConfirm={confirmUserDelete}
                onCancel={() => setUserToDelete(null)}
            />
        </div>
    );
}
