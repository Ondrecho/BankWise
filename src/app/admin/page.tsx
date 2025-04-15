'use client';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UsersManagement } from "@/components/admin/users-management";
import { RolesManagement } from "@/components/admin/roles-management";
//import { LogsManagement } from "@/components/admin/logs-management";
//import { StatisticsDashboard } from "@/components/admin/statistics-dashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem('credentials');
    router.push('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
      <div className="flex flex-col min-h-screen p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button
              variant="secondary"
              onClick={handleLogout}
              className="ml-auto"
          >
            Logout
          </Button>
        </header>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="roles">Role Management</TabsTrigger>
            <TabsTrigger value="logs">Logs Management</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Suspense fallback={<LoadingSpinner />}>
              <UsersManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="roles" className="mt-6">
            <Suspense fallback={<LoadingSpinner />}>
              <RolesManagement />
            </Suspense>
          </TabsContent>

{/*          <TabsContent value="logs" className="mt-6">
            <Suspense fallback={<LoadingSpinner />}>
              <LogsManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <Suspense fallback={<LoadingSpinner />}>
              <StatisticsDashboard />
            </Suspense>
          </TabsContent>*/}
        </Tabs>
      </div>
  );
}