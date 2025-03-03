import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UsersState, Role, Status , Gender } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// Initialize with default users if none exist in localStorage
const getInitialUsers = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  
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

const initialState: UsersState = {
  users: getInitialUsers(),
  filteredUsers: getInitialUsers(),
  isLoading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  selectedUsers: [],
  searchTerm: '',
  roleFilter: '',
  sortField: 'name',
  sortDirection: 'asc',
  totalPages: Math.ceil(getInitialUsers().length / 10), // Calculate totalPages based on initial users
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addUser: (state, action: PayloadAction<Omit<User, 'id'>>) => {
      const newUser = { ...action.payload, id: uuidv4() };
      state.users.push(newUser);
      localStorage.setItem('users', JSON.stringify(state.users));
      state.filteredUsers = applyFilters(state);
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
        localStorage.setItem('users', JSON.stringify(state.users));
        state.filteredUsers = applyFilters(state);
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      localStorage.setItem('users', JSON.stringify(state.users));
      state.filteredUsers = applyFilters(state);
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
      state.selectedUsers = state.selectedUsers.filter(id => id !== action.payload);
    },
    deleteMultipleUsers: (state) => {
      state.users = state.users.filter(user => !state.selectedUsers.includes(user.id));
      localStorage.setItem('users', JSON.stringify(state.users));
      state.filteredUsers = applyFilters(state);
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
      state.selectedUsers = [];
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
      state.currentPage = 1;
    },
    toggleSelectUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (state.selectedUsers.includes(userId)) {
        state.selectedUsers = state.selectedUsers.filter(id => id !== userId);
      } else {
        state.selectedUsers.push(userId);
      }
    },
    selectAllUsers: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        // Get IDs of current page users
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;
        const currentPageUsers = state.filteredUsers.slice(startIndex, endIndex);
        state.selectedUsers = currentPageUsers.map(user => user.id);
      } else {
        state.selectedUsers = [];
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredUsers = applyFilters(state);
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
      state.currentPage = 1;
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload;
      state.filteredUsers = applyFilters(state);
      state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
      state.currentPage = 1;
    },
    setSortField: (state, action: PayloadAction<string>) => {
      // If clicking the same field, toggle direction
      if (state.sortField === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = action.payload;
        state.sortDirection = 'asc';
      }
      state.filteredUsers = applyFilters(state);
    },
  },
});

// Helper function to apply all filters and sorting
const applyFilters = (state: UsersState): User[] => {
  let result = [...state.users];
  
  // Apply search
  if (state.searchTerm) {
    const searchLower = state.searchTerm.toLowerCase();
    result = result.filter(
      user => 
        user.name.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply role filter
  if (state.roleFilter) {
    result = result.filter(user => user.role === state.roleFilter);
  }
  
  // Apply sorting
  result.sort((a, b) => {
    const fieldA = a[state.sortField as keyof User];
    const fieldB = b[state.sortField as keyof User];
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return state.sortDirection === 'asc' 
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
    
    return 0;
  });
  
  return result;
};

export const { 
  setLoading, 
  setError, 
  addUser, 
  updateUser, 
  deleteUser, 
  deleteMultipleUsers,
  setCurrentPage,
  setItemsPerPage,
  toggleSelectUser,
  selectAllUsers,
  setSearchTerm,
  setRoleFilter,
  setSortField
} = usersSlice.actions;

export default usersSlice.reducer;