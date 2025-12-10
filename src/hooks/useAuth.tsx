import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContact: string;
  membershipPlan: 'Basic' | 'Premium' | 'VIP';
  membershipStatus: 'Active' | 'Expired' | 'Pending';
  membershipExpiry: string;
  joinDate: string;
  role: 'member' | 'trainer' | 'admin';
  profileImage?: string;
  // Trainer specific fields
  specialization?: string[];
  bio?: string;
  certifications?: string[];
  availability?: Record<string, string[]>;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<User>;
  updateUser: (userData: Partial<User>) => void;
  isAdmin: boolean;
  isTrainer: boolean;
  isMember: boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        // Optionally verify token with backend
        authAPI.getCurrentUser()
          .then(response => {
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
          })
          .catch(() => {
            // Token invalid, clear auth
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
          });
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      // Ensure dates are properly formatted
      const userData = {
        ...response.user,
        joinDate: response.user.joinDate || new Date().toISOString(),
        membershipExpiry: response.user.membershipExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const register = async (userData: any): Promise<User> => {
    try {
      const response = await authAPI.register(userData);
      // Ensure dates are properly formatted
      const userDataWithDates = {
        ...response.user,
        joinDate: response.user.joinDate || new Date().toISOString(),
        membershipExpiry: response.user.membershipExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
      };
      setUser(userDataWithDates);
      localStorage.setItem('user', JSON.stringify(userDataWithDates));
      return userDataWithDates;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateUser,
        isAdmin: user?.role === 'admin',
        isTrainer: user?.role === 'trainer',
        isMember: user?.role === 'member',
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};