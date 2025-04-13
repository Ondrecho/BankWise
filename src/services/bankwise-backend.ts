
/**
 * Represents user roles within the BankWise system.
 */
export type UserRole = 'admin' | 'client';

/**
 * Represents user data including username, email, and role.
 */
export interface User {
  /**
   * The username of the user.
   */
  username: string;
  /**
   * The email address of the user.
   */
  email: string;
  /**
   * The role of the user (e.g., 'admin', 'client').
   */
  role: UserRole;
}

/**
 * Asynchronously authenticates a user with the provided credentials.
 *
 * @param credentials An object containing the username/email and password for authentication.
 * @returns A promise that resolves to a User object upon successful authentication.
 */
export async function authenticate(credentials: any): Promise<any> {
  // TODO: Implement this by calling the BankWise Backend API.
  // This is a placeholder, replace with actual API call.
  console.log('Attempting to authenticate with:', credentials);

  // Simulate API response with JWT token and isAdmin flag.
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  localStorage.setItem('credentials', JSON.stringify(data));
  return data;
}

const credentials = {token: "eyJhbGciOiJIUzI1NiJ9.eyJpc0FkbWluIjp0cnVlLCJzdWIiOiJhZG1pbkBiYW5rLmNvbSIsImlhdCI6MTc0NDU2MTE5NCwiZXhwIjoyNzQ0NTYxMTk0fQ.9kyYeryvDEJNIr7uBrgTrbkyG3-YbOcwbspZ1RgGXxM", email: "admin@bank.com"};

export interface Role {
  id: number;
  name: string;
}

 export interface Account {
  id: number;
  iban: string;
  balance: number;
  currency: string;
  status: string;
}

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

export async function createUser(userData: any): Promise<User> {
  // TODO: Implement this by calling the BankWise Backend API.
  return {} as User;
}

export async function updateUser(userId: number, userData: any): Promise<User> {
  // TODO: Implement this by calling the BankWise Backend API.
  return {} as User;
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

export async function getRoles(): Promise<Role[]> {
  // TODO: Implement this by calling the BankWise Backend API.
  return [];
}

export async function createRole(roleData: any): Promise<Role> {
  // TODO: Implement this by calling the BankWise Backend API.
  return {} as Role;
}

export async function updateRole(roleId: number, roleData: any): Promise<Role> {
  // TODO: Implement this by calling the BankWise Backend API.
  return {} as Role;
}

export async function deleteRole(roleId: number): Promise<void> {
  // TODO: Implement this by calling the BankWise Backend API.
  return;
}

export async function getUserAccounts(userId: number ): Promise<Account[]> {
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

export async function closeAccount(iban: string): Promise<Response> {
  const url = `http://localhost:8080/api/accounts/${iban}/close`;
  console.log('Constructed URL:', url);
  console.log('Request Headers:', { Authorization: `Bearer ${credentials.token}` });

  const response = await fetch(url, {
      method: 'PATCH',
      headers: {
          'Authorization': `Bearer ${credentials.token}`,
      },
  });

  if (!response.ok) {
      throw new Error(`Failed to close account: ${response.statusText}`);
  }
  return response;
}

export async function createAccountForUser(userId: number, currency: string): Promise<Account> {
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

export async function openAccount(iban: string): Promise<Response> {
  const url = `http://localhost:8080/api/accounts/${iban}/open`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${credentials.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to open account: ${response.statusText}`);
  }
  return response;
}

export async function deleteAccount(iban: string): Promise<Response> {
  const url = `http://localhost:8080/api/accounts/${iban}`;
  const response = await fetch(url, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${credentials.token}`,
      },
  });

  if (!response.ok) {
      throw new Error(`Failed to delete account: ${response.statusText}`);
  }
  return response;
}

