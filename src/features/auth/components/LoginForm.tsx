'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { Loader2 } from 'lucide-react';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useAuth } from '@/context/authContext';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { toast } = useToast();
    const loginMutation = useLogin();
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        loginMutation.mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    login(data.token, data.isAdmin, email);

                    const { dismiss } = toast({
                        title: 'Login successful',
                        description: 'Welcome back!',
                    });

                    const targetRoute = data.isAdmin ? '/admin' : '/client';

                    setTimeout(() => {
                        if (window.location.pathname === '/auth/login') {
                            router.push(targetRoute);
                        }

                        dismiss();
                    }, 2000);
                },
                onError: (err: any) => {
                    toast({
                        variant: 'destructive',
                        title: 'Login failed',
                        description: err?.message || 'Invalid credentials.',
                    });
                },
            }
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-8">
            <h1 className="text-4xl font-bold mb-8">Login</h1>
            {loginMutation.isPending ? (
                <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin"/>
                    <span>Logging in...</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg px-8">
                    <Input type="email"
                           placeholder="Email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="py-4 px-3 text-lg"/>
                    <Input type="password"
                           placeholder="Password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="py-4 px-3 text-lg"/>
                    <Button type="submit" className="py-4 text-lg">Log In</Button>
                </form>
            )}
            {!loginMutation.isPending && (
                <Button variant="link" onClick={() => router.push('/auth/register')}>
                    Sign Up
                </Button>
            )}

            <p className="mt-4 text-sm text-center text-muted-foreground">
                Forgot your password?{" "}
                <button
                    className="text-blue-600 hover:underline"
                    onClick={() => router.push('/auth/reset-password')}
                >
                    Reset it here
                </button>
            </p>

        </div>
    );
}
