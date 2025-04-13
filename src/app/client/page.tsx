'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useState, useEffect} from 'react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

export default function ClientDashboard() {
  const [accounts, setAccounts] = useState([
    {id: '12345', balance: 1000, type: 'Checking'},
    {id: '67890', balance: 5000, type: 'Savings'},
  ]);

  const [transactions, setTransactions] = useState([
    {id: 'txn1', accountId: '12345', type: 'deposit', amount: 100},
    {id: 'txn2', accountId: '67890', type: 'withdrawal', amount: 50},
  ]);

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

  useEffect(() => {
    // Fetch user profile data from the API
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            setProfile(data);
            // Initialize the updated states with the current profile values
            setUpdatedFullName(data.fullName);
            setUpdatedEmail(data.email);
          } else {
            console.error("Response is not JSON");
          }
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleTransaction = (accountId: string, type: string) => {
    alert(`Transaction type ${type} for account ${accountId}`);
  };

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
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        console.error('Failed to update profile');
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Client Dashboard</h1>

      <Tabs defaultValue="profile" className="w-full max-w-2xl">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          {/*<TabsTrigger value="update">Update Data</TabsTrigger>*/}
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
              <ul>
                {accounts.map((account) => (
                  <li key={account.id} className="mb-2">
                    Account ID: {account.id}, Balance: {account.balance}, Type:{' '}
                    {account.type}
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => handleTransaction(account.id, 'deposit')}>
                        Deposit
                      </Button>
                      <Button onClick={() => handleTransaction(account.id, 'withdraw')}>
                        Withdraw
                      </Button>
                      <Button onClick={() => handleTransaction(account.id, 'transfer')}>
                        Transfer
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
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
