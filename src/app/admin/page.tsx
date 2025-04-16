'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { UsersIcon, ShieldIcon, FileTextIcon, BarChartIcon } from "@/components/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { User, Account, Role } from "@/types";

export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Mock roles data - будет заменено на запрос к API
  const [availableRoles, setAvailableRoles] = useState<Role[]>([
    { id: 1, name: 'individual', description: 'Частное лицо' },
    { id: 2, name: 'business', description: 'Юридическое лицо' },
    { id: 3, name: 'admin', description: 'Администратор' },
    { id: 4, name: 'support', description: 'Поддержка' },
    { id: 5, name: 'auditor', description: 'Аудитор' }
  ]);

  // Mock users data - будет заменено на запрос к API
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      dateOfBirth: "1990-01-01",
      active: true,
      roles: [{ id: 3, name: 'admin', description: 'Администратор' }],
      accounts: [
        {
          id: 1,
          iban: "BY00OLMP31310000000000000001",
          balance: 1000,
          currency: "USD",
          status: "ACTIVE",
          createdAt: "2023-01-01",
          userId: 1
        }
      ]
    }
  ]);

  const handleLogout = async () => {
    localStorage.removeItem('credentials');
    router.push('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setIsCreatingUser(false);
  };

  const handleCreateUser = () => {
    setIsCreatingUser(true);
    setSelectedUser({
      id: 0,
      fullName: "",
      email: "",
      dateOfBirth: "",
      active: true,
      roles: [],
      accounts: []
    });
  };

  const handleSaveUser = () => {
    if (isCreatingUser) {
      // Mock create user
      const newUser = {
        ...selectedUser!,
        id: Math.max(...users.map(u => u.id)) + 1
      };
      setUsers([...users, newUser]);
      toast({ title: "User created successfully" });
    } else {
      // Mock update user
      setUsers(users.map(u => u.id === selectedUser?.id ? selectedUser : u));
      toast({ title: "User updated successfully" });
    }
    handleBackToList();
  };

  const handleCreateAccount = () => {
    if (!selectedUser) return;
    const newAccount: Account = {
      id: Math.max(0, ...selectedUser.accounts?.map(a => a.id) || []) + 1,
      iban: `BY00OLMP313100000000000000${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      balance: 0,
      currency: "USD",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      userId: selectedUser.id
    };
    setSelectedUser({
      ...selectedUser,
      accounts: [...(selectedUser.accounts || []), newAccount]
    });
    toast({ title: "Account created successfully" });
  };

  const handleAccountAction = (action: 'close' | 'delete', iban: string) => {
    if (!selectedUser || !selectedUser.accounts) return;

    if (action === 'close') {
      setSelectedUser({
        ...selectedUser,
        accounts: selectedUser.accounts.map(a =>
            a.iban === iban ? {
              ...a,
              status: a.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE'
            } : a
        )
      });
    } else {
      setSelectedUser({
        ...selectedUser,
        accounts: selectedUser.accounts.filter(a => a.iban !== iban)
      });
    }
  };

  // Преобразуем роли для MultiSelect
  const roleOptions = availableRoles.map(role => ({
    value: role.name,
    label: role.description || role.name
  }));

  return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="container flex items-center justify-between h-16 px-4 mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <Button
                variant="outline"
                onClick={handleLogout}
                className="text-gray-600 hover:bg-gray-100"
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Card className="overflow-hidden">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="w-full grid grid-cols-4 rounded-none border-b bg-gray-50 px-0">
                <TabsTrigger value="users" className="py-4 px-6">
                <span className="flex items-center">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  User Management
                </span>
                </TabsTrigger>
                <TabsTrigger value="roles" className="py-4 px-6">
                <span className="flex items-center">
                  <ShieldIcon className="h-4 w-4 mr-2" />
                  Role Management
                </span>
                </TabsTrigger>
                <TabsTrigger value="logs" className="py-4 px-6">
                <span className="flex items-center">
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Logs Management
                </span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="py-4 px-6">
                <span className="flex items-center">
                  <BarChartIcon className="h-4 w-4 mr-2" />
                  Statistics
                </span>
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="users" className="mt-0">
                  {!selectedUser ? (
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>User Management</CardTitle>
                            <Button onClick={handleCreateUser}>Create New User</Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Accounts</TableHead>
                                <TableHead>Roles</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {users.map((user) => (
                                  <TableRow
                                      key={user.id}
                                      className="cursor-pointer hover:bg-gray-50"
                                      onClick={() => handleUserSelect(user)}
                                  >
                                    <TableCell>
                                      <Badge variant={user.active ? "default" : "destructive"}>
                                        {user.active ? "active" : "blocked"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.accounts?.length || 0}</TableCell>
                                    <TableCell>
                                      <div className="flex flex-wrap gap-1">
                                        {user.roles?.map((role) => (
                                            <Badge key={role.id} variant="secondary">
                                              {role.description || role.name}
                                            </Badge>
                                        ))}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                  ) : (
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>
                              {isCreatingUser ? "Create New User" : selectedUser.fullName}
                            </CardTitle>
                            <Button variant="outline" onClick={handleBackToList}>
                              Back to list
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">Personal Information</h3>
                              <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={selectedUser.fullName}
                                    onChange={(e) => setSelectedUser({
                                      ...selectedUser,
                                      fullName: e.target.value
                                    })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={selectedUser.email}
                                    onChange={(e) => setSelectedUser({
                                      ...selectedUser,
                                      email: e.target.value
                                    })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    value={selectedUser.dateOfBirth}
                                    onChange={(e) => setSelectedUser({
                                      ...selectedUser,
                                      dateOfBirth: e.target.value
                                    })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={selectedUser.active ? "active" : "blocked"}
                                    onValueChange={(value) => setSelectedUser({
                                      ...selectedUser,
                                      active: value === "active"
                                    })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="blocked">Blocked</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="roles">Roles</Label>
                                <MultiSelect
                                    options={roleOptions}
                                    selected={selectedUser.roles?.map(role => ({
                                      value: role.name,
                                      label: role.description || role.name
                                    })) || []}
                                    onChange={(selected) => {
                                      const selectedRoles = availableRoles.filter(role =>
                                          selected.some(s => s.value === role.name)
                                      );
                                      setSelectedUser({
                                        ...selectedUser,
                                        roles: selectedRoles
                                      });
                                    }}
                                    placeholder="Select roles..."
                                />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">Account Management</h3>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">Bank Accounts</h4>
                                  <Button size="sm" onClick={handleCreateAccount}>
                                    Create Account
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {selectedUser.accounts?.map((account) => (
                                      <Card key={account.id}>
                                        <CardContent className="p-4">
                                          <div className="flex justify-between items-center">
                                            <div>
                                              <p className="font-medium">{account.iban}</p>
                                              <p className="text-sm text-gray-500">
                                                {account.currency} • {account.balance}
                                              </p>
                                              <Badge variant={account.status === 'ACTIVE' ? 'default' : 'destructive'}>
                                                {account.status}
                                              </Badge>
                                            </div>
                                            <div className="space-x-2">
                                              <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => handleAccountAction('close', account.iban)}
                                              >
                                                {account.status === 'ACTIVE' ? 'Close' : 'Open'}
                                              </Button>
                                              <Button
                                                  variant="destructive"
                                                  size="sm"
                                                  onClick={() => handleAccountAction('delete', account.iban)}
                                              >
                                                Delete
                                              </Button>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button onClick={handleSaveUser}>
                            {isCreatingUser ? 'Create User' : 'Save Changes'}
                          </Button>
                        </CardFooter>
                      </Card>
                  )}
                </TabsContent>

                <TabsContent value="roles" className="mt-0">
                  <div className="flex items-center justify-center h-64">
                    <p>Role Management content will be here</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </main>
      </div>
  );
}