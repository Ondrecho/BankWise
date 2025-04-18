import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {BarChartIcon, FileTextIcon, ShieldIcon, UsersIcon} from "@/components/icons";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Account, Role, User} from "@/types";
import {Button} from "@/components/ui/button";
import {UserList} from "@/features/admin-users/components/UserList";
import {UserForm} from "@/features/admin-users/components/UserForm";
import {ConfirmDialog} from "@/components/shared/ConfirmDialog";

interface DashboardTabsProps {
    users: User[];
    selectedUser: User | null;
    availableRoles: Role[];

    userToDelete: User | null;
    setUserToDelete: (user: User | null) => void;
    confirmUserDelete: () => void;

    accountToDelete: Account | null;
    setAccountToDelete: (account: Account | null) => void;
    confirmAccountDelete: () => void;
    onAccountAction: (action: 'toggle-status' | 'delete', iban: string) => void;

    onUserSelect: (user: User) => void;
    onUserDelete: (user: User) => void;
    onCreateUser: () => void;
    onSaveUser: () => void;
    onBackToList: () => void;
    onUserChange: (user: User) => void;

    onCreateAccount: (currency: string) => void;
}

export function DashboardTabs({
                                  users,
                                  selectedUser,
                                  availableRoles,
                                  userToDelete,
                                  accountToDelete,
                                  setUserToDelete,
                                  confirmUserDelete,
                                  setAccountToDelete,
                                  confirmAccountDelete,
                                  onAccountAction,
                                  onUserSelect,
                                  onUserDelete,
                                  onCreateUser,
                                  onSaveUser,
                                  onBackToList,
                                  onUserChange,
                                  onCreateAccount
                              }: DashboardTabsProps)  {
    return (
    <Card className="overflow-hidden border-none shadow-none">
        <Tabs defaultValue="users" className="w-full">
            <TabsList className="h-auto w-full grid grid-cols-4 bg-transparent px-0 gap-1">
                <TabsTrigger
                    value="users"
                    className="py-3 px-4 data-[state=active]:shadow-none rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                >
                  <span className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2"/>
                    User Management
                  </span>
                </TabsTrigger>
                <TabsTrigger
                    value="roles"
                    className="py-3 px-4 data-[state=active]:shadow-none rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                >
                  <span className="flex items-center">
                    <ShieldIcon className="h-4 w-4 mr-2"/>
                    Role Management
                  </span>
                </TabsTrigger>
                <TabsTrigger
                    value="logs"
                    className="py-3 px-4 data-[state=active]:shadow-none rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                >
                  <span className="flex items-center">
                    <FileTextIcon className="h-4 w-4 mr-2"/>
                    Logs Management
                  </span>
                </TabsTrigger>
                <TabsTrigger
                    value="stats"
                    className="py-3 px-4 data-[state=active]:shadow-none rounded-t-lg border-b-2 data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
                >
                  <span className="flex items-center">
                    <BarChartIcon className="h-4 w-4 mr-2"/>
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
                                    <Button onClick={onCreateUser}>Create New User</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="px-0">
                                <UserList
                                    users={users}
                                    onSelect={onUserSelect}
                                    onDelete={onUserDelete}
                                />
                            </CardContent>
                        </Card>
                    ) : (
                        <UserForm
                            user={selectedUser}
                            roles={availableRoles}
                            onChangeAction={onUserChange}
                            onSaveAction={onSaveUser}
                            onBackAction={onBackToList}
                            onCreateAccountAction={onCreateAccount}
                            onAccountAction={onAccountAction}
                        />
                    )}
                    <ConfirmDialog
                        open={!!userToDelete}
                        title="Delete User"
                        description={`Are you sure to delete ${userToDelete?.fullName}?`}
                        onConfirm={confirmUserDelete}
                        onCancel={() => setUserToDelete(null)}
                    />

                    <ConfirmDialog
                        open={!!accountToDelete}
                        title="Delete Account"
                        description={`Delete account ${accountToDelete?.iban}?`}
                        onConfirm={confirmAccountDelete}
                        onCancel={() => setAccountToDelete(null)}
                    />
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
);
}