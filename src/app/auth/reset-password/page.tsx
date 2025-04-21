'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-2xl font-semibold mb-4">Password Reset</h1>
            <p className="text-muted-foreground max-w-md mb-6">
                The password reset functionality is not available yet. <br />
                Please contact your administrator for assistance.
            </p>
            <Button onClick={() => router.push('/auth/login')}>
                Back to Login
            </Button>
        </div>
    );
}
