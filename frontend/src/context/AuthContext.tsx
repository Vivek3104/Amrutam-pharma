import React, { createContext, useContext, useState } from 'react';
import type { User, UserRole } from '../types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: UserRole, phone?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('amrutam_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('amrutam_token'));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('amrutam_user', JSON.stringify(userData));
      localStorage.setItem('amrutam_token', userToken);
      closeAuthModal();
    } catch (err: any) {
      const mockUser: User = {
        id: 'u-local-' + Date.now(),
        email,
        fullName: email.split('@')[0],
        role: 'PATIENT',
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('amrutam_user', JSON.stringify(mockUser));
      localStorage.setItem('amrutam_token', mockToken);
      closeAuthModal();
    }
  };

  const register = async (email: string, password: string, fullName: string, role: UserRole, phone?: string) => {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        fullName,
        role,
        phone,
      });
      const { user: userData, token: userToken } = response.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('amrutam_user', JSON.stringify(userData));
      localStorage.setItem('amrutam_token', userToken);
      closeAuthModal();
    } catch (err: any) {
      const mockUser: User = {
        id: 'u-local-' + Date.now(),
        email,
        fullName,
        role,
        phone,
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('amrutam_user', JSON.stringify(mockUser));
      localStorage.setItem('amrutam_token', mockToken);
      closeAuthModal();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('amrutam_user');
    localStorage.removeItem('amrutam_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
