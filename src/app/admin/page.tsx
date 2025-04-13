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
} from "recharts";

interface User {
  id: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  roles: {id: number; name: string}[];
  accounts: any[];
}

interface Role {
  id: number;
  name: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      dateOfBirth: '1990-01-01',
      roles: [{id: 1, name: 'ROLE_ADMIN'}],
      accounts: [],
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      dateOfBirth: '1992-05-10',
      roles: [{id: 2, name: 'ROLE_USER'}],
      accounts: [],
    },
  ]);
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userAccounts, setUserAccounts] = useState([]);
  const [newAccountCurrency, setNewAccountCurrency] = useState("EUR");

  const [roles, setRoles] = useState<Role[]>([
    {id: 1, name: 'ROLE_ADMIN'},
    {id: 2, name: 'ROLE_USER'},
  ]);
  const [newRoleName, setNewRoleName] = useState('');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editedRoleName, setEditedRoleName] = useState('');

  // Logs Management
  const [logDate, setLogDate] = useState('');
  const [taskId, setTaskId] = useState('');
  const [logStatus, setLogStatus] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  // Stats Management
  const [pageStats, setPageStats] = useState({
    "/dashboard": 150,
    "/profile": 80,
    "/transactions": 45
  });
  const [pageVisitCount, setPageVisitCount] = useState(0);
  const [pageUrl, setPageUrl] = useState("/dashboard"); // Default URL

    // User Filtering
    const [fullNameFilter, setFullNameFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    // Mock API call to fetch users
    const fetchUsers = async () => {
        let filteredUsers = [
            {
                id: 1,
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                dateOfBirth: '1990-01-01',
                roles: [{id: 1, name: 'ROLE_ADMIN'}],
                accounts: [],
            },
            {
                id: 2,
                fullName: 'Jane Smith',
                email: 'jane.smith@example.com',
                dateOfBirth: '1992-05-10',
                roles: [{id: 2, name: 'ROLE_USER'}],
                accounts: [],
            },
        ];

        // Apply full name filter
        if (fullNameFilter) {
            filteredUsers = filteredUsers.filter(user =>
                user.fullName.toLowerCase().includes(fullNameFilter.toLowerCase())
            );
        }

        // Apply role filter
        if (roleFilter) {
            filteredUsers = filteredUsers.filter(user =>
                user.roles.some(role => role.name === roleFilter)
            );
        }

        setUsers(filteredUsers);
    };

    fetchUsers();

    // Mock API call to fetch roles
    const fetchRoles = async () => {
      // Simulate API response
      const mockedRoles = [
        {id: 1, name: 'ROLE_ADMIN'},
        {id: 2, name: 'ROLE_USER'},
      ];
      setRoles(mockedRoles);
    };

    fetchRoles();

    // Mock API call to fetch statistics
    const fetchStats = async () => {
      // Simulate API response
      const mockedStats = {
        "/dashboard": 150,
        "/profile": 80,
        "/transactions": 45
      };
      setPageStats(mockedStats);
    };

    fetchStats();
  }, [fullNameFilter, roleFilter]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewUser({...newUser, [event.target.name]: event.target.value});
  };

  const handleCreateUser = async () => {
    // Mock API call to create a user
    const newUserWithId = {
      ...newUser,
      id: users.length + 1,
      roles: [{name: newUser.role, id: 3}],
      accounts: [],
    };
    setUsers([...users, newUserWithId]);
    setNewUser({fullName: '', email: '', dateOfBirth: '', password: '', role: 'ROLE_USER'}); // Reset form
    toast({
      title: 'User created successfully!',
      description: `A new user with email ${newUser.email} has been created.`,
    });
  };

  const handleDeleteUser = async (userId: number) => {
    // Mock API call to delete a user
    setUsers(users.filter((user) => user.id !== userId));
    toast({
      title: 'User deleted successfully!',
      description: `User with ID ${userId} has been deleted.`,
    });
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

    // Mock API call to update a user
    const updatedUser = {
      ...editingUser,
      fullName: editedFullName,
      email: editedEmail,
      dateOfBirth: editedDateOfBirth,
      roles: [{name: editedRole, id: 3}],
    };

    setUsers(
      users.map((user) => (user.id === editingUser.id ? updatedUser : user))
    );
    setEditingUser(null); // Clear editing state
    toast({
      title: 'User updated successfully!',
      description: `User with ID ${updatedUser.id} has been updated.`,
    });
  };

    const handleViewAccounts = async (user: User) => {
        setSelectedUser(user);

        // Mock API call to fetch user accounts
        const mockedAccounts = [
            {
                id: 101,
                iban: 'DE12345678901234567890',
                balance: 5000,
                currency: 'EUR',
                status: 'ACTIVE'
            },
            {
                id: 102,
                iban: 'US98765432109876543210',
                balance: 7500,
                currency: 'USD',
                status: 'ACTIVE'
            }
        ];
        setUserAccounts(mockedAccounts);
    };

    const handleCreateAccount = async () => {
        if (!selectedUser) return;

        // Mock API call to create a new account for the selected user
        const newAccount = {
            id: userAccounts.length + 1,
            iban: 'MockedIBAN' + (userAccounts.length + 1),
            balance: 0,
            currency: newAccountCurrency,
            status: 'ACTIVE'
        };

        setUserAccounts([...userAccounts, newAccount]);
        toast({
            title: "Account created successfully!",
            description: `A new account with IBAN ${newAccount.iban} has been created for ${selectedUser.fullName}.`
        });
    };

    const handleDeleteAccount = async (iban: string) => {
        // Mock API call to delete an account
        setUserAccounts(userAccounts.filter(account => account.iban !== iban));
        toast({
            title: "Account deleted successfully!",
            description: `Account with IBAN ${iban} has been deleted.`
        });
    };

  // Role Management Handlers
  const handleCreateRole = async () => {
    // Mock API call to create a new role
    const newRole = {
      id: roles.length + 1,
      name: newRoleName,
    };
    setRoles([...roles, newRole]);
    setNewRoleName(''); // Reset input
    toast({
      title: 'Role created successfully!',
      description: `A new role with name ${newRole.name} has been created.`,
    });
  };

  const handleDeleteRole = async (roleId: number) => {
    // Mock API call to delete a role
    setRoles(roles.filter((role) => role.id !== roleId));
    toast({
      title: 'Role deleted successfully!',
      description: `Role with ID ${roleId} has been deleted.`,
    });
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setEditedRoleName(role.name);
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    // Mock API call to update a role
    const updatedRole = {
      ...editingRole,
      name: editedRoleName,
    };

    setRoles(
      roles.map((role) => (role.id === editingRole.id ? updatedRole : role))
    );
    setEditingRole(null); // Clear editing state
    toast({
      title: 'Role updated successfully!',
      description: `Role with ID ${updatedRole.id} has been updated.`,
    });
  };

  // Logs Management Handlers
  const handleGenerateLogs = async () => {
    // Mock API call to generate logs
    const mockedTaskId = '550e8400-e29b-41d4-a716-446655440000';
    setTaskId(mockedTaskId);
    setLogStatus('PENDING');

    toast({
      title: 'Log generation started!',
      description: `Task ID: ${mockedTaskId}. Check status to download.`,
    });

    // Simulate asynchronous log generation status check
    setTimeout(async () => {
      // Mock API call to check log generation status
      const mockedStatus = 'COMPLETED';
      const mockedProgress = 100;

      setLogStatus(mockedStatus);

      if (mockedStatus === 'COMPLETED') {
        // Mock API call to get the log file
        const mockedDownloadLink = '/api/logs/download/' + mockedTaskId;
        setDownloadLink(mockedDownloadLink);

        toast({
          title: 'Log generation completed!',
          description: `Logs for ${logDate} are ready to download.`,
        });
      } else {
        toast({
          title: 'Log generation failed!',
          description: `Failed to generate logs for ${logDate}.`,
          variant: "destructive",
        });
      }
    }, 5000); // Simulate 5 seconds of log generation
  };

  const handleCheckStatus = async () => {
    // Mock API call to check log generation status
    const mockedStatus = 'COMPLETED';
    const mockedProgress = 100;

    setLogStatus(mockedStatus);

    if (mockedStatus === 'COMPLETED') {
      // Mock API call to get the log file
      const mockedDownloadLink = '/api/logs/download/' + taskId;
      setDownloadLink(mockedDownloadLink);

      toast({
        title: 'Log generation completed!',
        description: `Logs for ${logDate} are ready to download.`,
      });
    } else {
      toast({
        title: 'Log generation pending!',
        description: `Log generation is still pending for ${logDate}.`,
      });
    }
  };

  // Stats Management Handlers
  const handleGetPageVisitCount = async () => {
    // Mock API call to get page visit count
    const mockedCount = Math.floor(Math.random() * 200);
    setPageVisitCount(mockedCount);

    toast({
      title: 'Page visit count fetched!',
      description: `Page ${pageUrl} has ${mockedCount} visits.`,
    });
  };

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
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

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
                      <SelectItem value="">All Roles</SelectItem>
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
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAccounts(user)}
                        >
                          View Accounts
                        </Button>
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
          {selectedUser && (
            <Card className="w-full max-w-4xl mt-4">
              <CardHeader>
                <CardTitle>Account Management for {selectedUser.fullName}</CardTitle>
                <CardDescription>
                  Manage {selectedUser.fullName}'s accounts.
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
                  <TableCaption>A list of existing accounts for {selectedUser.fullName}.</TableCaption>
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
