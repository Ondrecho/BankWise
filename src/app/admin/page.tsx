'use client';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {useToast} from '@/hooks/use-toast';
import {useState, useEffect} from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {useRouter} from "next/navigation";
import {
  getUsers, createUser, updateUser, deleteUser, getRoles, createRole, updateRole, deleteRole, getUserAccounts,
  User, Role, Account, generateLogs, checkLogStatus, getPageVisitCount, getOverallStatistics
} from "@/services/bankwise-backend";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    password: '',
    role: 'ROLE_USER',
  });
  const {toast} = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editedFullName, setEditedFullName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedDateOfBirth, setEditedDateOfBirth] = useState('');
  const [editedRole, setEditedRole] = useState('ROLE_USER');
  const [selectedUserId, setSelectedUserId] = useState<User | null>(null);
  const [userAccounts, setUserAccounts] = useState<Account[]>([]);
  const [newAccountCurrency, setNewAccountCurrency] = useState("EUR");

  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editedRoleName, setEditedRoleName] = useState('');

  // Logs Management
  const [logDate, setLogDate] = useState('');
  const [taskId, setTaskId] = useState('');
  const [logStatus, setLogStatus] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const [pageStats, setPageStats] = useState<{ [key: string]: number }>({});
  const [pageVisitCount, setPageVisitCount] = useState(0);
  const [pageUrl, setPageUrl] = useState("/dashboard"); // Default URL

    // User Filtering
    const [fullNameFilter, setFullNameFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const router = useRouter();

    const loadUsers = async () => {
        console.log("loadUsers called");
        try {
            const fetchedUsers = await getUsers(fullNameFilter, roleFilter);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                title: "Error fetching users!",
            });
        }
    };
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewUser({...newUser, [event.target.name]: event.target.value});
  }

  // User Management Handlers
  const handleCreateUser = async () => {
    try {
      const createdUser = await createUser(newUser);
      setUsers([...users, createdUser]);
      setNewUser({fullName: '', email: '', dateOfBirth: '', password: '', role: 'ROLE_USER'}); // Reset form
      toast({
        title: 'User created successfully!',
        description: `A new user with email ${createdUser.email} has been created.`,
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({
        title: 'Failed to create user!',
        description: 'Please check the provided information and try again.',
        variant: 'destructive',
      });
    }
    console.log("User created");
  };

    const handleDeleteUser = async (userId: number) => {
        if (typeof userId !== 'number') {
            console.error('Invalid userId:', userId);
            toast({
                title: 'Invalid User ID',
                description: 'The provided User ID is not valid.',
                variant: 'destructive',
            });
            return;
        }

        try {
            await deleteUser(userId);
            setUsers(users.filter((user) => user.id !== userId));
            toast({
                title: 'User Deleted',
                description: `User with ID ${userId} has been successfully deleted.`,
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast({ title: 'Failed to delete user!', description: 'Please try again.', variant: 'destructive' });
        }
    };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditedFullName(user.fullName);
    setEditedEmail(user.email);
    setEditedDateOfBirth(user.dateOfBirth);
    setEditedRole(user.roles[0].name); // Assuming single role for simplicity
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    const updatedUser = {
      ...editingUser,
      fullName: editedFullName,
      email: editedEmail,
      dateOfBirth: editedDateOfBirth,
      role: editedRole,
    };
    try {
      const result = await updateUser(updatedUser);
      setUsers(users.map((user) => (user.id === editingUser.id ? result : user)));
      setEditingUser(null);
      toast({title: 'User updated successfully!', description: `User with ID ${result.id} has been updated.`});
    } catch (error) {
      console.error('Failed to update user:', error);
      toast({title: 'Failed to update user!', description: 'Please try again.', variant: 'destructive'});
    }
    console.log("User updated");
  };

  const handleViewAccounts = async (user: User) => {
      setSelectedUserId(user);
      try {
          const accounts = await getUserAccounts(user.id);
          setUserAccounts(accounts);
          toast({title: 'Accounts loaded successfully!', description: `Accounts for ${user.fullName} loaded.`});

      } catch (error: any) {
          setUserAccounts([]);
          // Keep selectedUserId so the section doesn't disappear
          console.error('Failed to fetch user accounts:', error);
      toast({
        title: 'Failed to fetch accounts!',
          description: 'Could not retrieve accounts for this user.',
          variant: 'destructive',
      });
    }
  };

  const handleCreateAccount = async () => {
    // Implement the real server request here
    // Example: await deleteAccount(iban);
    toast({
      title: "Account deletion not implemented!",
      description: "This feature is not yet implemented.",
    });
  }

  // Role Management Handlers
  const handleCreateRole = async () => {
    try {
      const createdRole = await createRole({ name: newRoleName }); // Assuming createRole takes a Role object
          setRoles([...roles, createdRole]);
      setNewRoleName(''); // Reset input
      toast({
        title: 'Role created successfully!',
        description: `A new role with name ${createdRole.name} has been created.`,
      });
    } catch (error) {
      console.error('Failed to create role:', error);
      toast({
        title: 'Failed to create role!',
        description: 'Please check the provided information and try again.',
        variant: 'destructive',
      });
    }    
  };

  const handleDeleteRole = async (roleId: number) => {
      try {
          await deleteRole(roleId);
          setRoles(roles.filter((role) => role.id !== roleId));
          toast({
              title: 'Role deleted successfully!',
              description: `Role with ID ${roleId} has been deleted.`,
          });
      } catch (error) {
          console.error('Failed to delete role:', error);
          toast({
              title: 'Failed to delete role!',
              description: 'Please try again.',
              variant: 'destructive',
          });
      }    
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setEditedRoleName(role.name);
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

      try {
      const updatedRole = await updateRole({ ...editingRole, name: editedRoleName }); // Assuming updateRole takes a Role object
      if (updatedRole) {
        setRoles(
          roles.map((role) => (role.id === editingRole.id ? updatedRole : role))
        );
        setEditingRole(null); // Clear editing state
        toast({
          title: 'Role updated successfully!',
          description: `Role with ID ${updatedRole.id} has been updated.`,
        });
      } else {
        toast({
          title: 'Failed to update role!',
          description: 'Role not found or update failed.',
          variant: 'destructive',
        });
      }      
    } catch (error) {
      console.error('Failed to update role:', error);
      toast({title: 'Failed to update role!', description: 'Please try again.', variant: 'destructive'});
    }
  };

  // Logs Management Handlers
  const handleGenerateLogs = async () => {
    // Implement real server request to generate logs
    // Example: const taskId = await generateLogs(logDate);
    toast({
      title: "Log generation not implemented!",
      description: "This feature is not yet implemented.",
    });
  }

  const handleCheckStatus = async () => {};

  // Stats Management Handlers
  const handleGetPageVisitCount = async () => {
    try {
      const count = await getPageVisitCount(pageUrl);
      setPageVisitCount(count);
      toast({
        title: 'Page visit count fetched!',
        description: `Page ${pageUrl} has ${count} visits.`,
      });
    } catch (error) {
      console.error('Failed to fetch page visit count:', error);
      toast({ title: 'Failed to fetch visit count!', description: 'Please try again.', variant: 'destructive' });
    }
  }
  
  const renderBarChart = (data: { [key: string]: number }) => {
    const chartData = Object.entries(data).map(([url, count]) => ({
      url,
      visits: count,
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="url" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="visits" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  const handleLogout = async () => {
      localStorage.removeItem('credentials'); // Clear credentials from local storage
      router.push('/login'); // Redirect to the login page
      toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
      });
  };
  
  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <Button variant="secondary" onClick={handleLogout} className="self-end mr-4">
            Logout
        </Button>

      <Tabs defaultValue="users" className="w-full max-w-5xl">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="logs">Logs Management</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users, their roles, and accounts.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
              {/* Filtering Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullNameFilter">Filter by Full Name</Label>
                  <Input
                    type="text"
                    id="fullNameFilter"
                    name="fullNameFilter"
                    value={fullNameFilter}
                    onChange={(e) => setFullNameFilter(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="roleFilter">Filter by Role</Label>
                  <Select id="roleFilter" value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROLE_USER">User</SelectItem>
                      <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-2">Create New User</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={newUser.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={newUser.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" onValueChange={(value) => handleInputChange({target: {name: 'role', value} } as any)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROLE_USER">User</SelectItem>
                      <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreateUser}>Create User</Button>
              
              <Button onClick={loadUsers} className="mt-4">Load Users</Button>

              <h2 className="text-xl font-semibold mt-4 mb-2">Existing Users</h2>
              <Table>
                <TableCaption>A list of existing users in the system.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.dateOfBirth}</TableCell>
                      <TableCell>{user.roles[0].name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                        {selectedUserId !== user.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAccounts(user)}>
                            View Accounts
                          </Button>
                        )}

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {editingUser && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Edit User</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editFullName">Full Name</Label>
                      <Input
                        type="text"
                        id="editFullName"
                        value={editedFullName}
                        onChange={(e) => setEditedFullName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editEmail">Email</Label>
                      <Input
                        type="email"
                        id="editEmail"
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editDateOfBirth">Date of Birth</Label>
                      <Input
                        type="date"
                        id="editDateOfBirth"
                        value={editedDateOfBirth}
                        onChange={(e) => setEditedDateOfBirth(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editRole">Role</Label>
                      <Select value={editedRole} onValueChange={(value) => setEditedRole(value)}>
                        <SelectTrigger id="editRole">
                          <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ROLE_USER">User</SelectItem>
                          <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleUpdateUser} className="mt-2">
                    Update User
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>


          {/* User Account Management Section */}
          {selectedUserId && (
              <Card className="w-full max-w-4xl mt-4">
              <CardHeader>
                  <CardTitle>Account Management for {selectedUserId.fullName}</CardTitle>
                <CardDescription>
                  Manage {selectedUserId.fullName}'s accounts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Label htmlFor="currency">Currency:</Label>
                  <Select onValueChange={setNewAccountCurrency} defaultValue={newAccountCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder={newAccountCurrency} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="BYR">BYR</SelectItem>
                      <SelectItem value="RUB">RUB</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleCreateAccount}>Create New Account</Button>
                </div>

                <Table>
                  <TableCaption>A list of existing accounts for {selectedUserId.fullName}.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IBAN</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>{account.iban}</TableCell>
                        <TableCell>{account.balance}</TableCell>
                        <TableCell>{account.currency}</TableCell>
                        <TableCell>{account.status}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteAccount(account.iban)}
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
          )}
        </TabsContent>

        <TabsContent value="roles">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>Manage roles within the system.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <h2 className="text-xl font-semibold mb-2">Create New Role</h2>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    type="text"
                    id="roleName"
                    name="roleName"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleCreateRole}>Create Role</Button>

              <h2 className="text-xl font-semibold mt-4 mb-2">Existing Roles</h2>
              <Table>
                <TableCaption>A list of existing roles in the system.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {editingRole && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Edit Role</h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="editRoleName">Role Name</Label>
                      <Input
                        type="text"
                        id="editRoleName"
                        value={editedRoleName}
                        onChange={(e) => setEditedRoleName(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleUpdateRole} className="mt-2">
                    Update Role
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Logs Management</CardTitle>
              <CardDescription>Generate and download logs for specific dates.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logDate">Log Date</Label>
                  <Input
                    type="date"
                    id="logDate"
                    name="logDate"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleGenerateLogs}>Generate Logs</Button>

              {taskId && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Log Generation Status</h3>
                  <p>Task ID: {taskId}</p>
                  <p>Status: {logStatus || 'Pending...'}</p>

                  {logStatus !== 'COMPLETED' && (
                    <Button variant="secondary" onClick={handleCheckStatus}>
                      Check Status
                    </Button>
                  )}

                  {downloadLink && (
                    <a href={downloadLink} download className="block mt-2">
                      <Button>Download Logs</Button>
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>View statistics for the application.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <h2 className="text-xl font-semibold mb-2">Page Visit Count</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pageUrl">Page URL</Label>
                  <Input
                    type="text"
                    id="pageUrl"
                    name="pageUrl"
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleGetPageVisitCount}>Get Visit Count</Button>
              {pageVisitCount > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Visit Count</h3>
                  <p>Page {pageUrl} has {pageVisitCount} visits.</p>
                </div>
              )}

              <h2 className="text-xl font-semibold mt-4 mb-2">Overall Statistics</h2>
              {renderBarChart(pageStats)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

