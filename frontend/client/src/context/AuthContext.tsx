import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials, RegisterData } from '@/types/auth';
import { apiRequest } from '@/lib/queryClient';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to decode JWT and extract roles
  function decodeAndSetUser(token: string, userData: any) {
    try {
      const decoded: any = jwtDecode(token);
      // Support both 'role' and 'roles' claims
      let roles: string[] = [];
      if (decoded.role) {
        roles = [decoded.role];
      } else if (decoded.roles) {
        roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
      } else if (decoded.authorities) {
        roles = Array.isArray(decoded.authorities) ? decoded.authorities : [decoded.authorities];
      }
      setUser({ ...userData, roles });
    } catch (e) {
      setUser(userData);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiRequest('GET', '/api/auth/me');
      const data = await response.json();
      console.log('Check auth response:', data); // Debug log
      // Try to get token from localStorage and decode roles
      const token = localStorage.getItem('token');
      if (token) {
        decodeAndSetUser(token, data.data);
      } else {
        setUser(data.data);
      }
    } catch (error) {
      console.log('User not authenticated:', error); // Debug log
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await apiRequest('POST', '/api/auth/login', credentials);
    const data = await response.json();
    console.log('Login response:', data); // Debug log
    if (data.data && data.data.token) {
      localStorage.setItem('token', data.data.token);
      decodeAndSetUser(data.data.token, data.data);
    } else {
      setUser(data.data);
    }
  };

  const register = async (userData: RegisterData) => {
    await apiRequest('POST', '/api/auth/register', userData);
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
    } catch (error) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
