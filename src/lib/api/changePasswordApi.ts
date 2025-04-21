import { fetchWithAuth } from "@/lib/api/fetcher";

const API_URL = 'http://localhost:8080/api';

export async function changePassword(input: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) {
    const res = await fetchWithAuth(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message = data?.message || data?.error || 'Password change failed';
        const error = new Error(message);
        // @ts-ignore
        error.code = data?.errorCode;
        // @ts-ignore
        error.details = data?.details;
        throw error;
    }

    return data;
}