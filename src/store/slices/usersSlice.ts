import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User, UsersState, Role, Status } from '../../types';
import userService from '../../api/services/userService';
import { toast } from 'react-toastify';

const initialState: UsersState = {
  users: [],
  filteredUsers: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  selectedUsers: [],
  searchTerm: '',
  roleFilter: '',
  sortField: 'name',
  sortDirection: 'asc',
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getUsers();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      return rejectWithValue(message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id'>, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      toast.success('User created successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create user';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(userData);
      toast.success('User updated successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      toast.success('User deleted successfully');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteMultipleUsersThunk = createAsyncThunk(
  'users/deleteMultipleUsers',
  async (ids: string[], { rejectWithValue }) => {
    try {
      await userService.deleteMultipleUsers(ids);
      toast.success('Users deleted successfully');
      return ids;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete users';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
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
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.filteredUsers = applyFilters(state);
        state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload as User);
        state.filteredUsers = applyFilters(state);
        state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        const index = state.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser as User;
          state.filteredUsers = applyFilters(state);
        }
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const userId = action.payload;
        state.users = state.users.filter(user => user.id !== userId);
        state.filteredUsers = applyFilters(state);
        state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
        state.selectedUsers = state.selectedUsers.filter(id => id !== userId);
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete multiple users
      .addCase(deleteMultipleUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMultipleUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const userIds = action.payload;
        state.users = state.users.filter(user => !userIds.includes(user.id));
        state.filteredUsers = applyFilters(state);
        state.totalPages = Math.ceil(state.filteredUsers.length / state.itemsPerPage);
        state.selectedUsers = [];
      })
      .addCase(deleteMultipleUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
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
  setCurrentPage,
  setItemsPerPage,
  toggleSelectUser,
  selectAllUsers,
  setSearchTerm,
  setRoleFilter,
  setSortField
} = usersSlice.actions;

export default usersSlice.reducer;