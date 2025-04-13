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
} from "@/components/ui/alert-dialog"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import React from "react"; // Import React
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Fullname must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  dateOfBirth: z.string(),
  password: z.string().optional(),
})

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const {toast} = useToast();
  const [open, setOpen] = React.useState(false)
  const [newAccountCurrency, setNewAccountCurrency] = useState("EUR"); // Default currency

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      dateOfBirth: profile.dateOfBirth,
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data) {
              setProfile(data);
              setUpdatedFullName(data.fullName);
              setUpdatedEmail(data.email);
              setUpdatedDateOfBirth(data.dateOfBirth);
              setDate(new Date(data.dateOfBirth)); // Convert the date string to a Date object
            } else {
              console.error("Response has no content");
              toast({
                variant: "destructive",
                title: "Failed to fetch profile",
                description: "The profile data is empty."
              })
            }
          } else {
            console.error("Response is not JSON");
            toast({
              variant: "destructive",
              title: "Failed to fetch profile",
              description: "The response is not in JSON format."
            })
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

  const handleUpdateProfile = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          dateOfBirth: values.dateOfBirth,
          password: values.password, // Include the password in the update
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
      const response = await fetch(`/api/user/accounts?currency=${newAccountCurrency}`, {
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

  const handleOpenAccount = async (iban: string) => {
    try {
      const response = await fetch(`/api/accounts/${iban}/open`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setAccounts(accounts.map(account =>
          account.iban === iban ? {...account, status: 'ACTIVE'} : account
        ));
        toast({
          title: "Account opened successfully!",
          description: `Account with IBAN ${iban} has been opened.`
        });
      } else {
        console.error('Failed to open account');
        toast({
          variant: "destructive",
          title: "Failed to open account",
          description: `There was an error opening account with IBAN ${iban}.`
        });
      }
    } catch (error) {
      console.error('Error opening account:', error);
      toast({
        variant: "destructive",
        title: "Error opening account",
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

      <Tabs defaultValue="profile" className="w-full max-w-3xl">
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
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p>Full Name: {profile.fullName}</p>
                  <p>Email: {profile.email}</p>
                  <p>Date of Birth: {profile.dateOfBirth}</p>
                </div>
                <Button onClick={() => setOpen(true)}>Edit Profile</Button>
              </div>

              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Edit Profile</AlertDialogTitle>
                    <AlertDialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" placeholder="Date of Birth" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction type="submit">Save</AlertDialogAction>
                        </AlertDialogFooter>
                      </div>
                    </form>
                  </Form>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="accounts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
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
                          <div className="flex gap-2 mt-2">
                            <Button onClick={() => handleOpenAccount(account.iban)}>
                              Open Account
                            </Button>
                          </div>
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
