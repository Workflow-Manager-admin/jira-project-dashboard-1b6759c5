import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authenticateUser } from '../services/api';

const AuthContext = createContext();

// Auth reducer for state management
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        credentials: action.payload.credentials,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        credentials: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        credentials: null,
        error: null,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  credentials: null,
  isLoading: false,
  error: null,
};

// PUBLIC_INTERFACE
/**
 * Authentication context provider component
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('jira_auth');
    if (storedAuth) {
      try {
        const { user, credentials } = JSON.parse(storedAuth);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, credentials },
        });
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('jira_auth');
      }
    }
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Login function with credential validation and persistence
   */
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authenticateUser(credentials);
      
      if (response.success) {
        const authData = { user: response.user, credentials };
        
        // Store in localStorage
        localStorage.setItem('jira_auth', JSON.stringify(authData));
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: authData,
        });
        
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Logout function with cleanup
   */
  const logout = () => {
    localStorage.removeItem('jira_auth');
    dispatch({ type: 'LOGOUT' });
  };

  // PUBLIC_INTERFACE
  /**
   * Clear error state
   */
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// PUBLIC_INTERFACE
/**
 * Hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
