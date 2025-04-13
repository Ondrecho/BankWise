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
export async function authenticate(credentials: any): Promise<User> {
  // TODO: Implement this by calling the BankWise Backend API.

  return {
    username: 'testuser',
    email: 'test@example.com',
    role: 'client',
  };
}
