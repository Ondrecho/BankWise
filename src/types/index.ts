export interface User {
    id: number;
    fullName: string;
    email: string;
    dateOfBirth: string;
    password?: string;
    active: boolean;
    roles: Role[];
    accounts?: Account[];
}

export interface CreateUserDto {
    fullName: string;
    email: string;
    dateOfBirth: string;
    password: string;
    roles: { name: string }[];
}

export interface Role {
    id: number;
    name: string;
    description?: string;
}

export interface Account {
    createdAt: string;
    id: number;
    iban: string;
    balance: number;
    currency: string;
    status: 'ACTIVE' | 'CLOSED' | 'PENDING';
    userId: number;
}

export interface Log {
    id: number;
    date: string;
    action: string;
    userId: number;
    details: string;
}

export interface PageStat {
    url: string;
    visits: number;
}