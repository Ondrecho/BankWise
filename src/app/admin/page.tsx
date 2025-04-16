'use client';
import React, { useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {index} from "d3-array";


export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [newAccountCurrency, setNewAccountCurrency] = useState<string>("");
  const [showCurrencyModal, setShowCurrencyModal] = useState<boolean>(false);

  // Mock roles data
  const [availableRoles, setAvailableRoles] = useState<Role[]>([
    { id: 1, name: 'individual', description: 'Частное лицо' },
    { id: 2, name: 'business', description: 'Юридическое лицо' },
    { id: 3, name: 'admin', description: 'Администратор' },
    { id: 4, name: 'support', description: 'Поддержка' },
    { id: 6, name: 'auditor', description: 'Аудитор' },
    { id: 7, name: 'auditor2', description: 'Аудитор2' },
    { id: 8, name: 'auditor3', description: 'Аудитор3' },
    { id: 9, name: 'auditor4', description: 'Аудитор4' }
  ]);

  // Mock users data
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

  const handleUserDelete = (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserToDelete(user);
  };

  const confirmUserDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast({ title: "User deleted successfully" });
      setUserToDelete(null);
    }
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

  const handleCreateAccount = (currency: string) => {
    if (!selectedUser) return;
    const newAccount: Account = {
      id: Math.max(0, ...selectedUser.accounts?.map(a => a.id) || []) + 1,
      iban: `BY00OLMP313100000000000000${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0')}`,
      balance: 0,
      currency, // используем выбранную валюту
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
            a.iban === iban
                ? { ...a, status: a.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE' }
                : a
        )
      });
    } else {
      const account = selectedUser.accounts.find(a => a.iban === iban);
      if (account) {
        setAccountToDelete(account);
      }
    }
  };

  const confirmAccountDelete = () => {
    if (selectedUser && accountToDelete) {
      if (!selectedUser || !selectedUser.accounts) return;

      setSelectedUser({
        ...selectedUser,
        accounts: selectedUser.accounts.filter(a => a.iban !== accountToDelete.iban)
      });
      toast({ title: "Account deleted successfully" });
      setAccountToDelete(null);
    }
  };


  const roleOptions = availableRoles.map(role => ({
    value: role.id.toString(),
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
                className="text-gray-600 hover:bg-gray-300 hover:text-gray-900"
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Card className="overflow-hidden border-none shadow-none">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="h-auto w-full grid grid-cols-4 bg-transparent px-0 gap-1">
                <TabsTrigger
                    value="users"
                    className="py-3 px-4 data-[state=active]:shadow-none rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                >
                  <span className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    User Management
                  </span>
                </TabsTrigger>
                <TabsTrigger
                    value="roles"
                    className="py-3 px-4 data-[state=active]:shadow-none rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                >
                  <span className="flex items-center">
                    <ShieldIcon className="h-4 w-4 mr-2" />
                    Role Management
                  </span>
                </TabsTrigger>
                <TabsTrigger
                    value="logs"
                    className="py-3 px-4 data-[state=active]:shadow-none rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                >
                  <span className="flex items-center">
                    <FileTextIcon className="h-4 w-4 mr-2" />
                    Logs Management
                  </span>
                </TabsTrigger>
                <TabsTrigger
                    value="stats"
                    className="py-3 px-4 data-[state=active]:shadow-none rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                >
                  <span className="flex items-center">
                    <BarChartIcon className="h-4 w-4 mr-2" />
                    Statistics
                  </span>
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="users" className="mt-0">
                  {!selectedUser ? (
                      <Card className="border-none shadow-sm">
                        <CardHeader className="px-0 pt-0">
                          <div className="flex justify-between items-center">
                            <CardTitle>User Management</CardTitle>
                            <Button className="flex items-center justify-end pr-6" onClick={handleCreateUser}>Create New User</Button>
                          </div>
                        </CardHeader>
                        <CardContent className="px-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="pl-0">Status</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Accounts</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead className="pr-0">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {users.map((user) => (
                                  <TableRow
                                      key={user.id || `index-${index}`}
                                      className="cursor-pointer hover:bg-gray-50"
                                      onClick={() => handleUserSelect(user)}
                                  >
                                    <TableCell className="pl-0">
                                      <Badge variant={user.active ? "default" : "destructive"}>
                                        {user.active ? "active" : "blocked"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.accounts?.length || 0}</TableCell>
                                    <TableCell className="pr-0">
                                      <div className="inline-flex flex-wrap gap-1">
                                        {user.roles?.map((role) => (
                                            <Badge
                                                key={role.id}
                                                variant="secondary"
                                                className="px-2 py-0.5 text-xs"
                                            >
                                              {role.description || role.name}
                                            </Badge>
                                        ))}
                                      </div>
                                    </TableCell>
                                    <TableCell className="pr-0">
                                      <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={(e) => handleUserDelete(user, e)}
                                      >
                                        Delete
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                  ) : (
                      <Card className="border-none shadow-sm">
                        <CardHeader className="px-4 pt-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-semibold">
                              {isCreatingUser ? "Create New User" : selectedUser.fullName}
                            </CardTitle>
                            <div className="hidden md:flex gap-2">
                              <Button variant="outline" onClick={handleBackToList}>Cancel</Button>
                              <Button onClick={handleSaveUser}>
                                {isCreatingUser ? "Create User" : "Save Changes"}
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="px-4 py-6">
                          <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="mb-4 flex gap-2 border-b border-gray-300 justify-start items-stretch h-12">
                              <TabsTrigger
                                  value="personal"
                                  className="h-full m-0 flex items-center px-4 py-0 leading-none font-semibold text-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                              >
                                Personal Info
                              </TabsTrigger>
                              <TabsTrigger
                                  value="accounts"
                                  className="h-full m-0 flex items-center px-4 py-0 leading-none font-semibold text-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                              >
                                Bank Accounts
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        value={selectedUser.fullName}
                                        onChange={(e) =>
                                            setSelectedUser({
                                              ...selectedUser,
                                              fullName: e.target.value,
                                            })
                                        }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={selectedUser.email}
                                        onChange={(e) =>
                                            setSelectedUser({
                                              ...selectedUser,
                                              email: e.target.value,
                                            })
                                        }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={selectedUser.dateOfBirth}
                                        onChange={(e) =>
                                            setSelectedUser({
                                              ...selectedUser,
                                              dateOfBirth: e.target.value,
                                            })
                                        }
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={selectedUser.active ? "active" : "blocked"}
                                        onValueChange={(value) =>
                                            setSelectedUser({
                                              ...selectedUser,
                                              active: value === "active",
                                            })
                                        }
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
                                        selected={
                                            selectedUser.roles?.map(role => ({
                                              value: role.id.toString(),
                                              label: role.description || role.name
                                            })) || []
                                        }
                                        onChangeAction={(selected) => {
                                          const selectedRoles = availableRoles.filter(role =>
                                              selected.some(s => s.value === role.id.toString())
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
                              </div>
                            </TabsContent>
                            <TabsContent value="accounts">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold">Bank Accounts</h3>
                                  <Button size="sm" onClick={() => setShowCurrencyModal(true)}>
                                    Create Account
                                  </Button>
                                </div>
                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                  {selectedUser.accounts?.map((account) => (
                                      <Card key={account.id} className="border p-0">
                                        <CardContent className="p-4">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <p className="font-medium">{account.iban}</p>
                                              <p className="text-sm text-gray-500">
                                                {account.currency} • {account.balance}
                                              </p>
                                              <Badge
                                                  variant={account.status === "ACTIVE" ? "default" : "destructive"}
                                              >
                                                {account.status}
                                              </Badge>
                                            </div>
                                            <div className="flex space-x-2">
                                              <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => handleAccountAction('close', account.iban)}
                                              >
                                                {account.status === "ACTIVE" ? "Close" : "Open"}
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
                                  {accountToDelete && (
                                      <AlertDialog open onOpenChange={() => setAccountToDelete(null)}>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Account</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete account "{accountToDelete.iban}"? This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setAccountToDelete(null)} className="mr-2">
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-500 text-white hover:bg-red-600" onClick={confirmAccountDelete}>
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                  )}
                                </div>
                              </div>
                              {showCurrencyModal && (
                                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white rounded-lg p-6 w-80">
                                      <h2 className="text-lg font-semibold mb-4">Select Currency</h2>
                                      {/* Пример: Имеется небольшой селект с валютами; можно расширить список */}
                                      <select
                                          className="w-full border p-2 rounded mb-4"
                                          value={newAccountCurrency}
                                          onChange={(e) => setNewAccountCurrency(e.target.value)}
                                      >
                                        <option value="">Select Currency</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="BYN">BYN</option>
                                      </select>
                                      <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => {
                                          setShowCurrencyModal(false);
                                          setNewAccountCurrency("");
                                        }}>
                                          Cancel
                                        </Button>
                                        <Button
                                            onClick={() => {
                                              if (newAccountCurrency) {
                                                handleCreateAccount(newAccountCurrency);
                                                setShowCurrencyModal(false);
                                                setNewAccountCurrency("");
                                              } else {
                                                toast({ title: "Please select a currency" });
                                              }
                                            }}
                                        >
                                          Confirm
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 px-4 py-4 md:hidden">
                          <Button variant="outline" onClick={handleBackToList}>Cancel</Button>
                          <Button onClick={handleSaveUser}>
                            {isCreatingUser ? "Create User" : "Save Changes"}
                          </Button>
                        </CardFooter>
                      </Card>
                  )}
                  {userToDelete && (
                      <AlertDialog open onOpenChange={() => setUserToDelete(null)}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete user "{userToDelete.fullName}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setUserToDelete(null)}
                                className="mr-2"
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={confirmUserDelete}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  )}

                </TabsContent>

                <TabsContent value="roles" className="mt-0">
                  <div className="flex items-center justify-center h-64">
                    <p>Role Management content will be here</p>
                  </div>
                </TabsContent>

                <TabsContent value="logs" className="mt-0">
                  <div className="flex items-center justify-center h-64">
                    <p>Logs Management content will be here</p>
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="mt-0">
                  <div className="flex items-center justify-center h-64">
                    <p>Stats content will be here</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </main>
      </div>
  );
}