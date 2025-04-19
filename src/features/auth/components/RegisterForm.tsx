'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { useToast } from '@/hooks/use-toast';

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const { mutate, isPending } = useRegister();
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutate(
            { email, password, fullName, dateOfBirth },
            {
                onSuccess: () => {
                    toast({ title: 'Registration successful', description: 'You can now log in.' });
                    router.push('/auth/login');
                },
                onError: (err: any) => {
                    toast({
                        variant: 'destructive',
                        title: 'Registration failed',
                        description: err.message || 'Something went wrong.',
                    });
                },
            }
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <Input type="date" placeholder="Date of Birth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Registering...' : 'Register'}
                </Button>
            </form>
        </div>
    );
}
