'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useState, useEffect} from 'react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from "@/hooks/use-toast";
import {Separator} from "@/components/ui/separator";
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

export default function ClientDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState({
    id: 0,
    fullName: '',
    email: '',
    dateOfBirth: '',
    roles: [],
    accounts: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedFullName, setUpdatedFullName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedDateOfBirth, setUpdatedDateOfBirth] = useState('');
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const {toast} = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            setProfile(data);
            setUpdatedFullName(data.fullName);
            setUpdatedEmail(data.email);
            setUpdatedDateOfBirth(data.dateOfBirth);
            setDate(new Date(data.dateOfBirth)); // Convert the date string to a Date object
          } else {
            console.error("Response is not JSON");
          }
        } else {
          console.error('Failed to fetch profile');
          toast({
            variant: "destructive",
            title: "Failed to fetch profile",
            description: "There was an error fetching your profile data."
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: "An unexpected error occurred."
        })
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/user/accounts');
        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        } else {
          console.error('Failed to fetch accounts');
          toast({
            variant: "destructive",
            title: "Failed to fetch accounts",
            description: "There was an error fetching your account data."
          })
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        toast({
          variant: "destructive",
          title: "Error fetching accounts",
          description: "An unexpected error occurred."
        })
      }
    };

    fetchAccounts();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: updatedFullName,
          email: updatedEmail,
          dateOfBirth: updatedDateOfBirth,
          password: updatedPassword, // Include the password in the update
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsEditing(false);
        toast({
          title: "Profile updated successfully!",
          description: "Your profile information has been updated."
        });
      } else {
        console.error('Failed to update profile');
        toast({
          variant: "destructive",
          title: "Failed to update profile",
          description: "There was an error updating your profile."
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: "An unexpected error occurred."
      });
    }
  };

  const handleCreateAccount = async () => {
    try {
      const response = await fetch('/api/user/accounts?currency=EUR', {
        method: 'POST',
      });

      if (response.ok) {
        const newAccount = await response.json();
        setAccounts([...accounts, newAccount]);
        toast({
          title: "Account created successfully!",
          description: `A new account with IBAN ${newAccount.iban} has been created.`
        });
      } else {
        console.error('Failed to create account');
        toast({
          variant: "destructive",
          title: "Failed to create account",
          description: "There was an error creating a new account."
        });
      }
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: "An unexpected error occurred."
      });
    }
  };

  const handleCloseAccount = async (iban: string) => {
    try {
      const response = await fetch(`/api/accounts/${iban}/close`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setAccounts(accounts.map(account =>
          account.iban === iban ? {...account, status: 'CLOSED'} : account
        ));
        toast({
          title: "Account closed successfully!",
          description: `Account with IBAN ${iban} has been closed.`
        });
      } else {
        console.error('Failed to close account');
        toast({
          variant: "destructive",
          title: "Failed to close account",
          description: `There was an error closing account with IBAN ${iban}.`
        });
      }
    } catch (error) {
      console.error('Error closing account:', error);
      toast({
        variant: "destructive",
        title: "Error closing account",
        description: "An unexpected error occurred."
      });
    }
  };

  const handleTransaction = (accountId: string, type: string) => {
    alert(`Transaction type ${type} for account ${accountId}`);
  };

  const activeAccounts = accounts.filter(account => account.status === 'ACTIVE');
  const closedAccounts = accounts.filter(account => account.status === 'CLOSED');

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Client Dashboard</h1>

      <Tabs defaultValue="profile" className="w-full max-w-2xl">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p>Full Name: {profile.fullName}</p>
                      <p>Email: {profile.email}</p>
                      <p>Date of Birth: {profile.dateOfBirth}</p>
                    </div>
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={updatedFullName}
                        onChange={(e) => setUpdatedFullName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={updatedEmail}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="hidden"
                        id="dateOfBirth"
                        value={date ? format(date, "yyyy-MM-dd") : ''}
                        onChange={(e) => setUpdatedDateOfBirth(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="New Password"
                        value={updatedPassword}
                        onChange={(e) => setUpdatedPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateProfile}>Update Profile</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="accounts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreateAccount}>Create New Account</Button>
              <Separator className="my-2"/>
              {activeAccounts.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold">Active Accounts</h3>
                  <ul>
                    {activeAccounts.map((account) => (
                      <li key={account.id} className="mb-2">
                        IBAN: {account.iban}, Balance: {account.balance}, Currency:{' '}
                        {account.currency}, Status: {account.status}
                        <div className="flex gap-2 mt-2">
                          <Button onClick={() => handleTransaction(account.iban, 'deposit')}>
                            Deposit
                          </Button>
                          <Button onClick={() => handleTransaction(account.iban, 'withdraw')}>
                            Withdraw
                          </Button>
                          <Button onClick={() => handleTransaction(account.iban, 'transfer')}>
                            Transfer
                          </Button>
                          <Button variant="destructive" onClick={() => handleCloseAccount(account.iban)}>
                            Close Account
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-2"/>
                </>
              )}

              {closedAccounts.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold">Closed Accounts</h3>
                  <ul>
                    {closedAccounts.map((account) => (
                      <li key={account.id} className="mb-2">
                        IBAN: {account.iban}, Balance: {account.balance}, Currency:{' '}
                        {account.currency}, Status: {account.status}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {transactions.map((transaction) => (
                  <li key={transaction.id}>
                    Transaction ID: {transaction.id}, Account ID:{' '}
                    {transaction.accountId}, Type: {transaction.type}, Amount:{' '}
                    {transaction.amount}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
