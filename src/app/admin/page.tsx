'use client';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { DashboardTabs } from '@/components/admin/DashboardTabs';
import { useUsers } from '@/hooks/use-users';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    users,
    selectedUser,
    userToDelete,
    accountToDelete,
    availableRoles,
    handleLogout,
    handleUserSelect,
    handleUserDelete,
    confirmUserDelete,
    handleCreateUser,
    handleSaveUser,
    handleBackToList,
    handleCreateAccount,
    handleAccountAction,
    confirmAccountDelete,
    setAccountToDelete,
    setSelectedUser,
    setUserToDelete
  } = useUsers();

  return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <DashboardHeader onLogoutAction={handleLogout} />
        <main className="flex-1 p-6">
          <DashboardTabs
              users={users}
              selectedUser={selectedUser}
              availableRoles={availableRoles}
              userToDelete={userToDelete}
              accountToDelete={accountToDelete}
              setUserToDelete={setUserToDelete}
              confirmUserDelete={confirmUserDelete}
              setAccountToDelete={setAccountToDelete}
              confirmAccountDelete={confirmAccountDelete}
              onUserSelect={handleUserSelect}
              onUserDelete={handleUserDelete}
              onCreateUser={handleCreateUser}
              onSaveUser={handleSaveUser}
              onBackToList={handleBackToList}
              onCreateAccount={handleCreateAccount}
              onAccountAction={handleAccountAction}
              onUserChange={setSelectedUser}
          />
        </main>
      </div>
  );
}