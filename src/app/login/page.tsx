'use client';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useToast} from "@/hooks/use-toast";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
    const {toast} = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if data and isAdmin property exists
        if (data && data.admin) {
          router.push('/admin');
            toast({
                title: "Login successful",
                description: "Redirecting to admin dashboard...",
            })
        } else {
          router.push('/client');
            toast({
                title: "Login successful",
                description: "Redirecting to client dashboard...",
            })
        }
      } else {
        console.error('Authentication failed', data);
          toast({
              variant: "destructive",
              title: "Login failed",
              description: data.message || "Invalid credentials.",
          })
      }
    } catch (error) {
      console.error('Authentication failed', error);
        toast({
            variant: "destructive",
            title: "Login failed",
            description: "An error occurred while logging in.",
        })
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Log In</Button>
      </form>
      <Button variant="link" onClick={() => router.push('/register')}>
        Sign Up
      </Button>
    </div>
  );
}
