import { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types/auth';
import {
  initializeAuthDatabase,
  getCurrentSessionUser,
  loginUser,
  registerUser,
  logoutSession,
  createPasswordResetRequest,
  executePasswordReset,
  getStoredUsers,
  saveStoredUsers,
  sanitizeUser
} from '../utils/authStorage';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  agencyName?: string;
  licenseNumber?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; token?: string; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize DB and load active session on startup
  useEffect(() => {
    async function init() {
      try {
        await initializeAuthDatabase();
        const session = getCurrentSessionUser();
        if (session.user && session.token) {
          setUser(session.user);
          setToken(session.token);
        }
      } catch (err) {
        console.error('Failed to initialize auth session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Periodic token validity check
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      const session = getCurrentSessionUser();
      if (!session.user) {
        // Session expired
        setUser(null);
        setToken(null);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [token]);

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      const res = await loginUser(email, password, rememberMe);
      setUser(res.user);
      setToken(res.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed. Please verify your credentials.' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await registerUser(data);
      setUser(res.user);
      setToken(res.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    logoutSession();
    setUser(null);
    setToken(null);
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const res = await createPasswordResetRequest(email);
      return { success: true, token: res.token };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to generate password reset request.' };
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string) => {
    try {
      await executePasswordReset(resetToken, newPassword);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to reset password.' };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { success: false, error: 'No authenticated user' };

    try {
      const users = getStoredUsers();
      const index = users.findIndex((u) => u.id === user.id);
      if (index === -1) return { success: false, error: 'User record not found' };

      const updatedRecord = {
        ...users[index],
        ...updates
      };
      users[index] = updatedRecord;
      saveStoredUsers(users);

      const safeUser = sanitizeUser(updatedRecord);
      setUser(safeUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        requestPasswordReset,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
