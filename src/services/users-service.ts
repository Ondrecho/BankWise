import { User, Account } from "@/types";

const credentials = {token: "eyJhbGciOiJIUzI1NiJ9.eyJpc0FkbWluIjp0cnVlLCJzdWIiOiJhZG1pbkBiYW5rLmNvbSIsImlhdCI6MTc0NDU2MTE5NCwiZXhwIjoyNzQ0NTYxMTk0fQ.9kyYeryvDEJNIr7uBrgTrbkyG3-YbOcwbspZ1RgGXxM", email: "admin@bank.com"};


export async function getUsers(fullName?: string, roleName?: string, ): Promise<User[]> {
    let url = 'http://localhost:8080/api/admin/users';
    const params = new URLSearchParams();
    if (fullName) {
        params.append('fullName', fullName);
    }
    if (roleName) {
        params.append('roleName', roleName);
    }
    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    console.log('Constructed URL:', url);
    console.log('Request Headers:', { 'Authorization': `Bearer ${credentials.token}` });
    const response = await fetch(url, {
        method: 'GET',
        headers:{
            'Authorization': `Bearer ${credentials.token}`,
        },
    });
    console.log('Response Status:', response.status);
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);

    if (!response.ok) {
        const error = new Error(`Failed to fetch users: ${response.statusText}`);
        console.error('Fetch Error:', error);
        throw error;
    }

    const users = JSON.parse(responseBody);
    return users;
}

export async function createUser(userData: {
    fullName: string;
    email: string;
    dateOfBirth: string;
    password: string;
    roles: Array<{ name: string }>; // Изменили на name вместо id
}): Promise<User> {
    const response = await fetch('http://localhost:8080/api/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials.token}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
    }

    return await response.json();
}

export async function updateUser(
    userId: number | undefined,
    userData: { fullName?: string; email?: string; dateOfBirth?: string; roles?: Array<{ name: string }> }
): Promise<User> {
    const response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials.token}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
    }

    return await response.json();
}

export async function deleteUser(userId: number): Promise<any> {
    const url = `http://localhost:8080/api/admin/users/${userId}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${credentials.token}`,
        },
    });

    if (!response.ok) {
        const error = new Error(`Failed to delete user: ${response.statusText}`);
        console.error('Delete Error:', error);
        throw error;
    }
}

export async function getUserAccounts(userId: number | undefined): Promise<Account[]> {
    const url = `http://localhost:8080/api/admin/users/${userId}/accounts`;

    console.log('Constructed URL:', url);
    console.log('Request Headers:', { 'Authorization': `Bearer ${credentials.token}` });

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.token}`,
        },
    });

    console.log('Response Status:', response.status);
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);

    if (!response.ok) {
        throw new Error(`Failed to fetch user accounts: ${response.statusText}`);
    }
    return JSON.parse(responseBody) as Account[];
}

export async function closeAccount(iban: string): Promise<void> {
    const url = `http://localhost:8080/api/accounts/${iban}/close`;
    console.log('Constructed URL:', url);
    console.log('Request Headers:', { Authorization: `Bearer ${credentials.token}` });

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${credentials.token}`,
        },
    });
}

export async function createAccountForUser(userId: number | undefined, currency: string): Promise<Account> {
    const url = `http://localhost:8080/api/admin/users/${userId}/accounts?currency=${currency}`;
    console.log('Constructed URL:', url);
    console.log('Request Headers:', { 'Authorization': `Bearer ${credentials.token}` });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${credentials.token}`,
            'Content-Type': 'application/json',
        },
    });

    console.log('Response Status:', response.status);
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);

    if (!response.ok) {
        throw new Error(`Failed to create account for user: ${response.statusText}`);
    }
    return await response.json() as Account;
}

export async function openAccount(iban: string): Promise<void> {
    const url = `http://localhost:8080/api/accounts/${iban}/open`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${credentials.token}`,
        },
    });
}

export async function deleteAccount(iban: string): Promise<void> {
    const url = `http://localhost:8080/api/accounts/${iban}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${credentials.token}`,
        },
    });
}