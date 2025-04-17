import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {BarChartIcon, FileTextIcon, ShieldIcon, UsersIcon} from "@/components/icons";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Account, Role, User} from "@/types";
import {Button} from "@/components/ui/button";
import {UserList} from "@/components/admin/users/UsersList";
import {UserForm} from "@/components/admin/users/UserForm";
import {DeleteAccountDialog, DeleteUserDialog} from "@/components/admin/users/DeleteDialogs";

interface DashboardTabsProps {
    users: User[];
    selectedUser: User | null;
    availableRoles: Role[];
    userToDelete: User | null;
    accountToDelete: Account | null;
    onUserSelect: (user: User) => void;
    onUserDelete: (user: User | null) => void;
    onConfirmUserDelete: () => void;
    onCreateUser: () => void;
    onSaveUser: () => void;
    onBackToList: () => void;
    onCreateAccount: (currency: string) => void;
    onAccountAction: (action: 'close' | 'delete', iban: string) => void;
    onConfirmAccountDelete: () => void;
    onSetAccountToDelete: (account: Account | null) => void;
    onUserChange: (user: User) => void;
}

export function DashboardTabs({
                                  users,
                                  selectedUser,
                                  availableRoles,
                                  userToDelete,
                                  accountToDelete,
                                  onUserSelect,
                                  onUserDelete,
                                  onConfirmUserDelete,
                                  onCreateUser,
                                  onSaveUser,
                                  onBackToList,
                                  onCreateAccount,
                                  onAccountAction,
                                  onConfirmAccountDelete,
                                  onSetAccountToDelete,
                                  onUserChange
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
                                    onSelectAction={onUserSelect}
                                    onDeleteAction={onUserDelete}
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
                    <DeleteUserDialog
                        user={userToDelete}
                        open={!!userToDelete}
                        onConfirmAction={onConfirmUserDelete}
                        onCancelAction={() => onUserDelete(null)}
                    />

                    <DeleteAccountDialog
                        account={accountToDelete}
                        open={!!accountToDelete}
                        onConfirmAction={onConfirmAccountDelete}
                        onCancelAction={() => onSetAccountToDelete(null)}
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