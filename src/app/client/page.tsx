'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useState} from 'react';

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
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '1990-01-01',
  });

  const handleTransaction = (accountId: string, type: string) => {
    alert(`Transaction type ${type} for account ${accountId}`);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Client Dashboard</h1>

      <Tabs defaultValue="profile" className="w-full max-w-2xl">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="update">Update Data</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Full Name: {profile.fullName}</p>
              <p>Email: {profile.email}</p>
              <p>Date of Birth: {profile.dateOfBirth}</p>
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
        <TabsContent value="update" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Update User Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Placeholder for user data update form.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
