'use client';

import ChangePasswordDialog from "@/components/shared/ChangePasswordDialog";

export default function AdminPage() {
  return (
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-6 text-muted-foreground">
          Welcome to the admin panel. You can manage users, accounts, and more.
        </p>

        <ChangePasswordDialog />
      </div>
  );
}