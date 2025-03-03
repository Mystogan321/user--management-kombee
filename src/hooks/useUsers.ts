import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { 
  fetchUsers,
  createUser, 
  updateUserThunk, 
  deleteUserThunk, 
  deleteMultipleUsersThunk,
  setCurrentPage,
  setItemsPerPage,
  toggleSelectUser,
  selectAllUsers,
  setSearchTerm,
  setRoleFilter,
  setSortField
} from '../store/slices/usersSlice';
import { User } from '../types';
import { useEffect } from 'react';

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    users,
    filteredUsers,
    isLoading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    selectedUsers,
    searchTerm,
    roleFilter,
    sortField,
    sortDirection
  } = useSelector((state: RootState) => state.users);

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Get current page data
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  // Check if all users on current page are selected
  const areAllCurrentPageUsersSelected = () => {
    const currentPageUsers = getCurrentPageUsers();
    return currentPageUsers.length > 0 && 
      currentPageUsers.every(user => selectedUsers.includes(user.id));
  };

  // Add a new user
  const addNewUser = (userData: Omit<User, 'id'>) => {
    dispatch(createUser(userData));
  };

  // Update an existing user
  const updateExistingUser = (userData: User) => {
    dispatch(updateUserThunk(userData));
  };

  // Delete a user
  const deleteExistingUser = (userId: string) => {
    dispatch(deleteUserThunk(userId));
  };

  // Delete multiple users
  const deleteSelectedUsers = () => {
    if (selectedUsers.length === 0) return;
    dispatch(deleteMultipleUsersThunk(selectedUsers));
  };

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    dispatch(toggleSelectUser(userId));
  };

  // Toggle select all users on current page
  const toggleSelectAllUsers = () => {
    dispatch(selectAllUsers(!areAllCurrentPageUsersSelected()));
  };

  // Change page
  const changePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // Set items per page
  const changeItemsPerPage = (items: number) => {
    dispatch(setItemsPerPage(items));
  };

  // Search users
  const searchUsers = (term: string) => {
    dispatch(setSearchTerm(term));
  };

  // Filter by role
  const filterByRole = (role: string) => {
    dispatch(setRoleFilter(role));
  };

  // Sort users
  const sortUsers = (field: string) => {
    dispatch(setSortField(field));
  };

  return {
    users,
    filteredUsers,
    currentPageUsers: getCurrentPageUsers(),
    isLoading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    selectedUsers,
    searchTerm,
    roleFilter,
    sortField,
    sortDirection,
    areAllSelected: areAllCurrentPageUsersSelected(),
    addUser: addNewUser,
    updateUser: updateExistingUser,
    deleteUser: deleteExistingUser,
    deleteMultipleUsers: deleteSelectedUsers,
    toggleSelectUser: toggleUserSelection,
    toggleSelectAll: toggleSelectAllUsers,
    setCurrentPage: changePage,
    setItemsPerPage: changeItemsPerPage,
    setSearchTerm: searchUsers,
    setRoleFilter: filterByRole,
    setSortField: sortUsers,
  };
};