import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { login, logout } from '../store/slices/authSlice';
import { LoginCredentials } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const loginUser = async (credentials: LoginCredentials) => {
    const resultAction = await dispatch(login(credentials));
    return login.fulfilled.match(resultAction);
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginUser,
    logout: logoutUser,
  };
};