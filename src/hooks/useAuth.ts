import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { login as loginAction, logout as logoutAction } from '../store/slices/authSlice';
import { LoginCredentials } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: LoginCredentials) => {
    return await dispatch(loginAction(credentials) as any);
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
};