'use client';

import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to BankWise</h1>
      <p className="text-lg mb-8">Your trusted partner for financial solutions.</p>
      <Button onClick={() => router.push('/auth/login')}>Log In</Button>
    </div>
  );
}
