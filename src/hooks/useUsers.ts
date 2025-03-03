import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
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
  setSortField,
  setLoading
} from '../store/slices/usersSlice';
import { User } from '../types';

export const useUsers = () => {
  const dispatch = useDispatch();
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
    dispatch(setLoading(true));
    
    // Simulate API delay
    setTimeout(() => {
      dispatch(addUser(userData));
      dispatch(setLoading(false));
    }, 500);
  };

  // Update an existing user
  const updateExistingUser = (userData: User) => {
    dispatch(setLoading(true));
    
    // Simulate API delay
    setTimeout(() => {
      dispatch(updateUser(userData));
      dispatch(setLoading(false));
    }, 500);
  };

  // Delete a user
  const deleteExistingUser = (userId: string) => {
    dispatch(setLoading(true));
    
    // Simulate API delay
    setTimeout(() => {
      dispatch(deleteUser(userId));
      dispatch(setLoading(false));
    }, 500);
  };

  // Delete multiple users
  const deleteSelectedUsers = () => {
    if (selectedUsers.length === 0) return;
    
    dispatch(setLoading(true));
    
    // Simulate API delay
    setTimeout(() => {
      dispatch(deleteMultipleUsers());
      dispatch(setLoading(false));
    }, 500);
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