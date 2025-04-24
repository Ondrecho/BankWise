// src/lib/api/authApi.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || 'Login failed');
    }

    return data;
}

export async function registerUser(input: {
    email: string;
    password: string;
    fullName: string;
    dateOfBirth: string;
}) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });

    if (res.status === 201) {
        return {};
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message = data?.error || 'Registration failed';
        throw new Error(message);
    }

    return data;
}
