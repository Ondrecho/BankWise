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

type User = {
  id: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  status: 'active' | 'blocked';
  roles: string[];
  accounts: Account[];
};

type Account = {
  id: number;
  iban: string;
  balance: number;
  currency: string;
  status: 'active' | 'closed';
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      dateOfBirth: "1990-01-01",
      status: "active",
      roles: ["Admin"],
      accounts: [
        { id: 1, iban: "BY00OLMP31310000000000000001", balance: 1000, currency: "USD", status: "active" },
        { id: 2, iban: "BY00OLMP31310000000000000002", balance: 500, currency: "EUR", status: "active" }
      ]
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane@example.com",
      dateOfBirth: "1992-05-15",
      status: "active",
      roles: ["User"],
      accounts: [
        { id: 3, iban: "BY00OLMP31310000000000000003", balance: 200, currency: "BYN", status: "active" }
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
  };

  const handleCreateUser = () => {
    setIsCreatingUser(true);
    setSelectedUser({
      id: 0,
      fullName: "",
      email: "",
      dateOfBirth: "",
      status: "active",
      roles: [],
      accounts: []
    });
  };

  const handleSaveUser = () => {
    // Здесь будет логика сохранения пользователя
    if (isCreatingUser) {
      toast({ title: "User created successfully" });
    } else {
      toast({ title: "User updated successfully" });
    }
    setSelectedUser(null);
    setIsCreatingUser(false);
  };

  const handleBlockUser = () => {
    if (!selectedUser) return;
    // Здесь будет логика блокировки пользователя
    toast({ title: `User ${selectedUser.status === 'active' ? 'blocked' : 'unblocked'}` });
    setSelectedUser(null);
  };

  const handleCreateAccount = () => {
    if (!selectedUser) return;
    // Здесь будет логика создания счета
    toast({ title: "Account created successfully" });
  };

  const handleAccountAction = (action: 'close' | 'delete', iban: string) => {
    // Здесь будет логика действий со счетом
    toast({ title: `Account ${action === 'close' ? 'closed' : 'deleted'}` });
  };

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
              <TabsList className="rounded-none border-b bg-gray-50 px-6 py-4">
                <div className="flex space-x-4">
                  <TabsTrigger value="users">
                  <span className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    User Management
                  </span>
                  </TabsTrigger>
                  <TabsTrigger value="roles">
                  <span className="flex items-center">
                    <ShieldIcon className="h-4 w-4 mr-2" />
                    Role Management
                  </span>
                  </TabsTrigger>
                  <TabsTrigger value="logs">
                  <span className="flex items-center">
                    <FileTextIcon className="h-4 w-4 mr-2" />
                    Logs Management
                  </span>
                  </TabsTrigger>
                  <TabsTrigger value="stats">
                  <span className="flex items-center">
                    <BarChartIcon className="h-4 w-4 mr-2" />
                    Statistics
                  </span>
                  </TabsTrigger>
                </div>
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
                                      <Badge variant={user.status === "active" ? "default" : "destructive"}>
                                        {user.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.accounts.length}</TableCell>
                                    <TableCell>
                                      <div className="flex flex-wrap gap-1">
                                        {user.roles.map((role, index) => (
                                            <Badge key={index} variant="secondary">
                                              {role}
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
                                    value={selectedUser.status}
                                    onValueChange={(value) => setSelectedUser({
                                      ...selectedUser,
                                      status: value as 'active' | 'blocked'
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
                                <Label>Roles</Label>
                                <div className="flex flex-wrap gap-2">
                                  {selectedUser.roles.map((role, index) => (
                                      <Badge key={index} variant="secondary">
                                        {role}
                                      </Badge>
                                  ))}
                                </div>
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
                                  {selectedUser.accounts.map((account) => (
                                      <Card key={account.id}>
                                        <CardContent className="p-4">
                                          <div className="flex justify-between items-center">
                                            <div>
                                              <p className="font-medium">{account.iban}</p>
                                              <p className="text-sm text-gray-500">
                                                {account.currency} • {account.balance}
                                              </p>
                                            </div>
                                            <div className="space-x-2">
                                              <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => handleAccountAction('close', account.iban)}
                                              >
                                                {account.status === 'active' ? 'Close' : 'Open'}
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
                        <CardFooter className="flex justify-between">
                          {!isCreatingUser && (
                              <Button
                                  variant={selectedUser.status === 'active' ? "destructive" : "default"}
                                  onClick={handleBlockUser}
                              >
                                {selectedUser.status === 'active' ? 'Block User' : 'Unblock User'}
                              </Button>
                          )}
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