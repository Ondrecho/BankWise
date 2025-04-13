# BankWise Frontend

**BankWise** is a modern web—based banking management application, including user registration, account management, transaction execution, and administrative functions for administrators. The frontend is developed using React and Material-UI, and also interacts with the API hosted in the [Online Banking](https://github.com/Ondrecho/OnlineBanking) repository.

## Main Functions

**Registration and Login:**
- Registration of new users.
- Login of registered users using JWT.

**User's Personal Account:**
- Displays a list of user accounts.
- Create new accounts with a choice of currency.
- Making transactions (deposit, withdrawal, transfer).
- Updating user data (name, date of birth, email).
- Closing and opening accounts.

**Admin Panel:**
- Add users without registration.
- Deleting users.
- Updating user data.
- Assigning roles to users.
- Closing and opening accounts of any users.
- Getting a filtered list of users.
- Adding users en masse.
- Deleting accounts.
- View session statistics and logs.

## Technology

**Frontend:**
- **React.js**: For user interface development.
  - **Material-UI**: For styling components.
  - **Axios**: For making HTTP requests to the API.
  - **React Router**: For navigating between pages.
  - **React Query**: For state management and data caching.
  - **Lodash**: For utility functions (for example, duplicate checking).

**API:**
  - **BankWise Backend**: The API hosted in the [Online Banking](https://github.com/Ondrecho/OnlineBanking) repository is used.

## Installation and Launch

1. **Install Node.js and npm:**
- Download and install Node.js from the [official website](https://nodejs.org).

2. **Cloning the Repository:**
```sh
git clone https://github.com/Ondrecho/BankWise.git
cd bankwise-frontend
```
3. **Installing Dependencies:**
```sh
npm install
```
4. **Setting Environment Variables:**
Create a file .env in the root of the project and add the necessary environment variables, for example:
```env
REACT_APP_API_URL=http://localhost:8080/api
```    
5. **Launching the Application:**
```sh
npm start
```
The application will be launched on http://localhost:3000