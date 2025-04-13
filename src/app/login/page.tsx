'use client';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {authenticate} from '@/services/bankwise-backend';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const user = await authenticate({username, password});
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/client');
      }
    } catch (error) {
      console.error('Authentication failed', error);
      alert('Authentication failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <Input
          type="text"
          placeholder="Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Log In</Button>
      </form>
    </div>
  );
}
