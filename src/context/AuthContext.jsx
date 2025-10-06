import React, { createContext, useReducer, useEffect } from 'react';
import AuthService from '../services/authService';
import { AUTH_ACTIONS, INITIAL_AUTH_STATE } from './authConstants';

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...INITIAL_AUTH_STATE,
        loading: false
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.TOKEN_REFRESH:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user || state.user
      };

    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_AUTH_STATE);

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      try {
        const token = localStorage.getItem('auth_token');
        const storedUser = AuthService.getStoredUser();

        if (token && storedUser) {
          try {
            const currentUser = await AuthService.getCurrentUser();
            dispatch({
              type: AUTH_ACTIONS.SET_USER,
              payload: currentUser
            });
          } catch {
            console.log('Stored token is invalid, clearing auth data');
            AuthService.logout();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch {
        console.error('Auth initialization error');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const data = await AuthService.login(email, password);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: data.user,
          token: data.token
        }
      });

      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const data = await AuthService.register(userData);
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: {
          user: data.user,
          token: data.token
        }
      });

      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await AuthService.updateProfile(profileData);
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: data.user
      });
      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
      dispatch({
        type: AUTH_ACTIONS.TOKEN_REFRESH,
        payload: {
          token: data.token,
          user: data.user
        }
      });
      return true;
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      logout();
      return false;
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const isAdmin = () => hasRole('ADMIN');

  const isUser = () => hasRole('USER');

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
    clearError,
    hasRole,
    isAdmin,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;