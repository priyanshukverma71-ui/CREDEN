import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  switchDemoRole: (role: UserRole, institutionCode?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('creden_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session or default to AICTE_ADMIN for zero-friction evaluation
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('creden_token');
      if (storedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setToken(storedToken);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Session verification fallback, re-authenticating demo account...');
        }
      }

      // If no stored token or validation failed, establish baseline authenticated session
      try {
        const demoRes = await fetch('/api/auth/switch-demo-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'AICTE_ADMIN' }),
        });
        if (demoRes.ok) {
          const data = await demoRes.json();
          login(data.token, data.user);
        }
      } catch (err) {
        console.warn('Demo session init fallback');
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('creden_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('creden_token');
    setToken(null);
    setUser(null);
  };

  const switchDemoRole = async (role: UserRole, institutionCode?: string) => {
    try {
      const res = await fetch('/api/auth/switch-demo-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, institutionCode }),
      });
      if (res.ok) {
        const data = await res.json();
        login(data.token, data.user);
      }
    } catch (e) {
      console.error('Failed to switch demo role:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
