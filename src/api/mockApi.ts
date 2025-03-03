import MockAdapter from 'axios-mock-adapter';
import api from './axios';
import { v4 as uuidv4 } from 'uuid';
import { User, Role, Status, LoginCredentials , Gender } from '../types';

// Create a new instance of the mock adapter
const mock = new MockAdapter(api, { delayResponse: 800 });

// Helper function to get users from localStorage
const getUsers = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  
  // Default users if none exist
  const defaultUsers: User[] = [
    { id: '1', name: 'Administrator', email: 'admin@gmail.com', role: Role.ADMIN, dob: '1980-01-01', gender: Gender.MALE, status: Status.ACTIVE, password: 'admin123' },
    { id: '2', name: 'Sub Admin', email: 'subadmin@gmail.com', role: Role.SUB_ADMIN, dob: '1985-05-15', gender: Gender.FEMALE, status: Status.ACTIVE, password: 'subadmin123' },
    { id: '3', name: 'John Doe', email: 'johndoe@gmail.com', role: Role.CUSTOMER, dob: '1992-10-10', gender: Gender.MALE, status: Status.INACTIVE, password: 'customer123' },
    { id: '4', name: 'Jane Smith', email: 'janesmith@gmail.com', role: Role.CUSTOMER, dob: '1995-08-25', gender: Gender.FEMALE, status: Status.ACTIVE, password: 'password123' },
    { id: '5', name: 'Robert Brown', email: 'robertbrown@gmail.com', role: Role.ADMIN, dob: '1978-02-17', gender: Gender.MALE, status: Status.ACTIVE, password: 'adminpass' },
    { id: '6', name: 'Emily Davis', email: 'emilydavis@gmail.com', role: Role.SUB_ADMIN, dob: '1989-11-03', gender: Gender.FEMALE, status: Status.ACTIVE, password: 'subpass' },
    { id: '7', name: 'Michael Johnson', email: 'michaelj@gmail.com', role: Role.CUSTOMER, dob: '1997-06-30', gender: Gender.MALE, status: Status.INACTIVE, password: 'customerpass' },
    { id: '8', name: 'Sophia White', email: 'sophiaw@gmail.com', role: Role.CUSTOMER, dob: '1993-04-12', gender: Gender.FEMALE, status: Status.ACTIVE, password: 'sophiapass' },
    { id: '9', name: 'Daniel Miller', email: 'danielm@gmail.com', role: Role.ADMIN, dob: '1982-12-05', gender: Gender.MALE, status: Status.ACTIVE, password: 'danielpass' },
    { id: '10', name: 'Olivia Taylor', email: 'oliviat@gmail.com', role: Role.SUB_ADMIN, dob: '1990-09-21', gender: Gender.FEMALE, status: Status.ACTIVE, password: 'oliviapass' },
    { id: '11', name: 'Ethan Wilson', email: 'ethanw@gmail.com', role: Role.CUSTOMER, dob: '1998-07-08', gender: Gender.MALE, status: Status.INACTIVE, password: 'ethanpass' },
    { id: '12', name: 'Ava Moore', email: 'avam@gmail.com', role: Role.CUSTOMER, dob: '1996-03-14', gender: Gender.FEMALE, status: Status.ACTIVE, password: 'avapass' },
    { id: '13', name: 'Liam Anderson', email: 'liama@gmail.com', role: Role.ADMIN, dob: '1987-05-29', gender: Gender.MALE, status: Status.ACTIVE, password: 'liampass' },
    { id: '14', name: 'Mia Thomas', email: 'miat@gmail.com', role: Role.SUB_ADMIN, dob: '1991-10-31', gender: Gender.FEMALE, status: Status.ACTIVE, password: 'miapass' },
    { id: '15', name: 'William Martinez', email: 'williamm@gmail.com', role: Role.CUSTOMER, dob: '1999-01-07', gender: Gender.MALE, status: Status.INACTIVE, password: 'williampass' },
    { id: '16', name: 'Charlotte Jackson', email: 'charlottej@gmail.com', role: Role.CUSTOMER, dob: '1994-06-22', gender: Gender.FEMALE, status: Status.ACTIVE, password: 'charlottepass' },
    { id: '17', name: 'Benjamin Harris', email: 'benjaminh@gmail.com', role: Role.ADMIN, dob: '1984-08-15', gender: Gender.MALE, status: Status.ACTIVE, password: 'benjaminpass' },
    { id: '18', name: 'Ella Clark', email: 'ellac@gmail.com', role: Role.SUB_ADMIN, dob: '1992-02-28', gender: Gender.FEMALE, status: Status.ACTIVE, password: 'ellapass' },
    { id: '19', name: 'James Lewis', email: 'jamesl@gmail.com', role: Role.CUSTOMER, dob: '2000-11-09', gender: Gender.MALE, status: Status.INACTIVE, password: 'jamespass' },
    { id: '20', name: 'Amelia Walker', email: 'ameliaw@gmail.com', role: Role.CUSTOMER, dob: '1997-09-18', gender: Gender.FEMALE, status: Status.ACTIVE, password: 'ameliapass' }
  ];
 
  
  localStorage.setItem('users', JSON.stringify(defaultUsers));
  return defaultUsers;
};

// Helper function to save users to localStorage
const saveUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Mock login endpoint
mock.onPost('/api/auth/login').reply((config) => {
  const { email, password } = JSON.parse(config.data) as LoginCredentials;
  const users = getUsers();
  
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  
  if (user) {
    // Generate a fake token
    const token = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem('token', token);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return [200, { user: userWithoutPassword, token }];
  } else {
    return [401, { message: 'Invalid email or password' }];
  }
});

// Mock logout endpoint
mock.onPost('/api/auth/logout').reply(200, { success: true });

// Mock get all users endpoint
mock.onGet('/api/users').reply(() => {
  const users = getUsers();
  // Return users without passwords
  const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
  return [200, usersWithoutPasswords];
});

// Mock get user by id endpoint
mock.onGet(/\/api\/users\/\d+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const users = getUsers();
  const user = users.find((user) => user.id === id);
  
  if (user) {
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return [200, userWithoutPassword];
  } else {
    return [404, { message: 'User not found' }];
  }
});

// Mock create user endpoint
mock.onPost('/api/users').reply((config) => {
  const userData = JSON.parse(config.data);
  const users = getUsers();
  
  // Check if email already exists
  const emailExists = users.some((user) => user.email === userData.email);
  if (emailExists) {
    return [400, { message: 'Email already exists' }];
  }
  
  // Create new user with ID
  const newUser: User = {
    ...userData,
    id: uuidv4(),
  };
  
  // Add to users array and save
  users.push(newUser);
  saveUsers(users);
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return [201, userWithoutPassword];
});

// Mock update user endpoint
mock.onPut(/\/api\/users\/.*/).reply((config) => {
  const id = config.url?.split('/').pop();
  const userData = JSON.parse(config.data);
  const users = getUsers();
  
  // Find user index
  const userIndex = users.findIndex((user) => user.id === id);
  
  if (userIndex === -1) {
    return [404, { message: 'User not found' }];
  }
  
  // Check if email already exists (for another user)
  const emailExists = users.some(
    (user) => user.email === userData.email && user.id !== id
  );
  if (emailExists) {
    return [400, { message: 'Email already exists' }];
  }
  
  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...userData,
    id, // Ensure ID doesn't change
  };
  
  saveUsers(users);
  
  // Return user without password
  const { password, ...userWithoutPassword } = users[userIndex];
  return [200, userWithoutPassword];
});

// Mock delete user endpoint
mock.onDelete(/\/api\/users\/.*/).reply((config) => {
  const id = config.url?.split('/').pop();
  const users = getUsers();
  
  // Filter out the user to delete
  const updatedUsers = users.filter((user) => user.id !== id);
  
  if (updatedUsers.length === users.length) {
    return [404, { message: 'User not found' }];
  }
  
  saveUsers(updatedUsers);
  return [200, { message: 'User deleted successfully' }];
});

// Mock delete multiple users endpoint
mock.onDelete('/api/users/batch').reply((config) => {
  const { ids } = JSON.parse(config.data);
  const users = getUsers();
  
  // Filter out users to delete
  const updatedUsers = users.filter((user) => !ids.includes(user.id));
  
  saveUsers(updatedUsers);
  return [200, { message: 'Users deleted successfully' }];
});

export default mock;