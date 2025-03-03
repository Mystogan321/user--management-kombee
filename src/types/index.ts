export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  dob?: string;
  gender?: Gender;
  status: Status;
  password?: string;
}

export enum Role {
  ADMIN = 'Administrator',
  SUB_ADMIN = 'Sub Admin',
  CUSTOMER = 'Customer'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}


export interface UsersState {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  selectedUsers: string[];
  searchTerm: string;
  roleFilter: string;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserFormValues {
  name: string;
  email: string;
  role: Role;
  dob?: string;
  gender?: Gender;
  status: Status;
  password: string;
  confirmPassword: string;
}