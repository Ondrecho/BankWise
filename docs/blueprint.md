# **App Name**: BankWise

## Core Features:

- Login Form: Implements a login form with fields for username/email and password, and integration with the BankWise Backend API for authentication.
- Role-Based Redirection: A simple UI that conditionally renders elements of the page based on the user role (admin/client), as returned by the API.
- Home Page: Display information about the bank and a login button on the main page.
- Client Dashboard: Display an extremely basic client dashboard. The dashboard will show a welcome message. No other functionality implemented for the MVP.
- Admin Dashboard: Display an extremely basic admin dashboard. The dashboard will show a welcome message. No other functionality implemented for the MVP.

## Style Guidelines:

- Primary color: A professional and trustworthy blue (#007BFF).
- Secondary color: A clean and modern gray (#6C757D).
- Accent: A subtle green (#28A745) for success messages and interactive elements.
- Clean and readable sans-serif fonts throughout the application.
- Use simple and professional icons from Material-UI's icon library.
- A clean and well-organized layout with clear sections for each function.

## Original User Request:
Goal: To create a BankWise web application on React with a division into bank client mode and admin mode, depending on the API response after login.

Functional Requirements:

All Users:

Access to the main page of the website with information about the bank and the "Log in" button.
The "Login" button redirects to the login or registration page.
Registered Users:

The ability to log in.
Access to the personal account where their accounts will be displayed.
The ability to make transactions (deposit, withdrawal, transfer) to other accounts.
The ability to update your data.
The ability to close and open your accounts.
Admin:

The ability to add users without registering.
The ability to delete users.
The ability to change user data.
The ability to add and remove roles.
The ability to close and open accounts of any users.
The ability to get a filtered list of users.
The ability to add users en masse.
The ability to delete accounts.
The ability to view session statistics and logs.
Technologies:

Frontend:
Use React.js for UI development.
Use the Material-UI to style components.
Use Axios to make HTTP requests to the API.
Use React Router to navigate between pages.
Use React Query for state management and data caching.
API:

Use the API hosted in the BankWise Backend repository.
Upon successful login, the API returns a response containing the user's role (client or admin).
Depending on the user's role, redirect to the appropriate interface.:
Client: A personal account with the following features:
Create your own accounts.
Make transfers to other accounts, withdrawals and deposits.
Close and open your accounts.
Edit your data.
Admin: Admin panel with features:
Add users without registering.
Delete users.
To change user data.
Add and remove roles.
Close and open accounts of any users.
Get a list of users with filtering.
Add users en masse.
Delete accounts.
View session statistics and logs.
Project Structure:

The main page (Home.js): Information about the bank and the "Log in" button.
Login and Registration Page (Login.js , Register.js): User login and registration forms.
The User's Personal Account (UserDashboard.js): Displaying invoices, creating new invoices, transactions, editing data.
Admin Panel (AdminDashboard.js): Managing users, accounts, roles, and logs.
Services for interacting with the API (apiService.js , authService.js , userService.js ).
Utilities and validation (utils/constants.js , utils/helpers.js, validation/validation.js ).
Additional Components:

Home.js: The main page with information about the bank and the "Log in" button.
LoginForm.js : User login form.
RegisterForm.js : A form for registering a new user.
UserDashboard.js: A user's personal account with the ability to manage their accounts and data.
AdminDashboard.js: An admin panel with the ability to manage users, accounts, roles, and logs.
AccountsList.js: A component for displaying a list of user accounts.
CreateAccountForm.js : A form for creating a new account.
TransactionForm.js : Forms for making transactions (deposit, withdrawal, transfer).
UpdateUserForm.js : A form for updating user data.
UsersTable.js: A table with users for the admin.
CreateUserForm.js : A form for adding users without registration.
CreateRoleForm.js : A form for creating new roles.
TransactionsTable.js: A table with transactions.
LogsTable.js: A table with logs of visits and transactions.
  